// File: lib/fetchMenu.ts
import { patchRetrieveByCatId } from "@/utils/patchRetrieveByCatId"; // expects string input, not array

export interface CatalogObject {
  type: string;
  id: string;
  is_deleted?: boolean;
  item_data?: {
    id: string;
    name: string;
    product_type?: string;
    reporting_category?: { id: string };
    variations?: {
      item_variation_data?: {
        pricing_type?: string;
        price_money?: {
          amount: number;
          currency: string;
        };
        sellable?: boolean;
      };
    }[];
  };
}

export interface MenuItem {
  id: string;
  item_id: string;
  name: string;
  product_type?: string;
  amount: string;
  currency: string;
  category_id?: string;
  category_name?: string | null;
}

export interface GroupedMenu {
  category_name: string;
  items: MenuItem[];
}

export const fetchMenuItemList = async (cursorParam: string | null = null): Promise<GroupedMenu[] | null> => {
  console.log("FetchMenuList.....");

  try {
    const url = cursorParam ? `/api/category-list?cursor=${cursorParam}` : `/api/category-list`;
    const response = await fetch(url);
    const data: { cursor?: string; objects?: CatalogObject[] } = await response.json();

    const validItems = (data?.objects || []).filter((obj) => {
      if (obj.type !== "ITEM" || obj.is_deleted || !obj.item_data) return false;
      const sellable = obj.item_data.variations?.some(
        (variation) => variation.item_variation_data?.sellable
      );
      return sellable;
    });

    const menuItems: MenuItem[] = [];

    for (const item of validItems) {
      const { id, name, product_type, reporting_category, variations } = item.item_data!;
      const variation = variations?.find(
        (v) => v.item_variation_data?.sellable && v.item_variation_data?.price_money
      );
      const price = variation?.item_variation_data?.price_money;
      if (!price) continue;

      const category_id = reporting_category?.id;
      let category_name: string | null = null;

      if (category_id) {
        try {
          category_name = await patchRetrieveByCatId([category_id]);
        } catch (err) {
          console.warn(`Failed to get category name for ${category_id}`, err);
        }
      }

      menuItems.push({
        id,
        item_id: item.id,
        name,
        product_type,
        amount: "$ " + (price.amount / 100).toFixed(2),
        currency: price.currency,
        category_id,
        category_name,
      });
    }

    // Group items by category_name
    const grouped: Record<string, MenuItem[]> = {};
    for (const item of menuItems) {
      const category = item.category_name || "Uncategorized";
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(item);
    }

    const groupedMenu: GroupedMenu[] = Object.entries(grouped).map(([category_name, items]) => ({
      category_name,
      items,
    }));

    console.log("GroupedMenuList.....", groupedMenu);

    return groupedMenu;
  } catch (error) {
    console.error("Failed to load menu:", error);
    return null;
  }
};
