// File: lib/fetchMenu.ts
import { patchRetrieveByCatId } from "@/utils/patchRetrieveByCatId";

export interface CatalogObject {
  type: string;
  id: string;
  item_data?: {
    name: string;
    categories?: { id: string; ordinal: number }[];
  };
}

export interface CategoryWithName {
  name: string;
}

export interface CategoryMap {
  [id: string]: CategoryWithName;
}

export const fetchMenu = async (cursorParam: string | null = null): Promise<CategoryWithName[] | null> => {
  try {
    const url = cursorParam ? `/api/category-list?cursor=${cursorParam}` : `/api/category-list`;
    const response = await fetch(url);
    const data: { cursor?: string; objects?: CatalogObject[] } = await response.json();

    const newItems: CatalogObject[] = (data?.objects || []).filter(
      (obj: CatalogObject) => obj.type === "ITEM"
    );

    const categoryMap: CategoryMap = {};
    const categoryIdSet: Set<string> = new Set();

    for (const item of newItems) {
      const categories = item.item_data?.categories || [];
      for (const category of categories) {
        if (!categoryIdSet.has(category.id)) {
          categoryIdSet.add(category.id);
        }
      }
    }

    for (const categoryId of categoryIdSet) {
      const name = await patchRetrieveByCatId([categoryId]);
      if (!Object.values(categoryMap).some((category) => category.name === name)) {
        categoryMap[categoryId] = {
          name: name || "Unknown",
        };
      }
    }

    const categoryArray = Object.values(categoryMap);
    return categoryArray;
  } catch (error) {
    console.error("Failed to load menu:", error);
    return null;
  }
};
