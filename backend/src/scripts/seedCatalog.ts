/**
 * Seeds the global food catalog into Firestore.
 *
 *   foodCatalog/{slug}  — reusable single items everyone can search
 *   mealCatalog/{slug}  — ready-made meals built from those items
 *
 * Run:  npm run seed   (from the backend folder)
 */
import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { db } from '../config/firebase';
import { FoodItem } from '../interface/foodItem.model';
import { Meal, MealItem } from '../interface/meal.model';
import { MacroTotals } from '../interface/food.model';

interface RawItem {
  name: string;
  caloriesPer100: number;
  proteinPer100: number;
  carbsPer100: number;
  fatPer100: number;
  fiberPer100: number;
  defaultQuantity: number;
}
interface RawMeal {
  name: string;
  components: { item: string; quantity: number }[];
}

const slug = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

function computeTotals(items: MealItem[]): MacroTotals {
  return items.reduce(
    (acc, item) => {
      const f = item.quantity / 100;
      return {
        calories: acc.calories + item.caloriesPer100 * f,
        protein: acc.protein + item.proteinPer100 * f,
        carbs: acc.carbs + item.carbsPer100 * f,
        fat: acc.fat + item.fatPer100 * f,
        fiber: acc.fiber + item.fiberPer100 * f,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );
}

/** Commit writes in chunks to stay under the 500-op batch limit. */
async function commitInChunks(writes: { ref: FirebaseFirestore.DocumentReference; data: object }[]) {
  const CHUNK = 400;
  for (let i = 0; i < writes.length; i += CHUNK) {
    const batch = db.batch();
    for (const w of writes.slice(i, i + CHUNK)) batch.set(w.ref, w.data);
    await batch.commit();
  }
}

async function main() {
  const raw = JSON.parse(
    readFileSync(join(__dirname, '..', 'data', 'foodCatalog.json'), 'utf8')
  ) as { items: RawItem[]; meals: RawMeal[] };

  const now = new Date().toISOString();
  const itemBySlug = new Map<string, { id: string; item: RawItem }>();
  const itemWrites: { ref: FirebaseFirestore.DocumentReference; data: object }[] = [];

  for (const it of raw.items) {
    const id = slug(it.name);
    if (itemBySlug.has(id)) {
      console.warn(`⚠️  duplicate item slug "${id}" (${it.name}) — skipping duplicate`);
      continue;
    }
    itemBySlug.set(id, { id, item: it });
    const doc: FoodItem = {
      id,
      name: it.name,
      nameLower: it.name.toLowerCase(),
      caloriesPer100: it.caloriesPer100,
      proteinPer100: it.proteinPer100,
      carbsPer100: it.carbsPer100,
      fatPer100: it.fatPer100,
      fiberPer100: it.fiberPer100,
      defaultQuantity: it.defaultQuantity,
      usageCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    itemWrites.push({ ref: db.collection('foodCatalog').doc(id), data: doc });
  }

  const mealWrites: { ref: FirebaseFirestore.DocumentReference; data: object }[] = [];
  for (const m of raw.meals) {
    const items: MealItem[] = [];
    let ok = true;
    for (const c of m.components) {
      const found = itemBySlug.get(slug(c.item));
      if (!found) {
        console.error(`❌ meal "${m.name}" references unknown item "${c.item}" — skipping meal`);
        ok = false;
        break;
      }
      const s = found.item;
      items.push({
        name: s.name,
        quantity: c.quantity,
        caloriesPer100: s.caloriesPer100,
        proteinPer100: s.proteinPer100,
        carbsPer100: s.carbsPer100,
        fatPer100: s.fatPer100,
        fiberPer100: s.fiberPer100,
        sourceItemId: found.id,
      });
    }
    if (!ok) continue;
    const id = slug(m.name);
    const doc: Meal = {
      id,
      name: m.name,
      items,
      totals: computeTotals(items),
      createdAt: now,
      updatedAt: now,
    };
    mealWrites.push({ ref: db.collection('mealCatalog').doc(id), data: doc });
  }

  await commitInChunks(itemWrites);
  await commitInChunks(mealWrites);

  console.log(`✅ Seeded ${itemWrites.length} food items and ${mealWrites.length} meals.`);
  process.exit(0);
}

main().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
