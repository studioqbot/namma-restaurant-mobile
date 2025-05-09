/* eslint-disable */
import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosResponse } from 'axios';

const SQUARE_API_URL = process.env.NEXT_PUBLIC_APP_SQUARE_API_URL;
const SQUARE_ACCESS_TOKEN = process.env.NEXT_PUBLIC_APP_SQUARE_ACCESS_TOKEN_PROD;

// Simple in-memory cache
let cachedData: any = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

function getNested(obj: any, path: string): any {
  return path.split('.').reduce((o, key) => (o == null ? undefined : o[key]), obj);
}

interface SquareCatalogObject {
  type: string;
  is_deleted?: boolean;
  item_data?: {
    reporting_category?: { id?: string };
    name?: string;
    variations?: {
      item_variation_data?: {
        price_money?: {
          amount?: number;
          currency?: string;
        };
      };
    }[];
  };
}

interface SquareCatalogResponse {
  objects?: SquareCatalogObject[];
  cursor?: string | null;
}

// interface MenuItem {
//   [key: string]: string | number | undefined;
// }
interface MenuItem {
  [key: string]: any;  // This will allow any string key with any value
}

interface GroupedCategory {
  category_id: string;
  items: MenuItem[];
}

export async function GET(_req: NextRequest): Promise<NextResponse> {
  if (!SQUARE_API_URL || !SQUARE_ACCESS_TOKEN) {
    return NextResponse.json(
      { error: 'Missing Square configuration in environment variables' },
      { status: 500 }
    );
  }

  // Return cached data if still valid
  const now = Date.now();
  if (cachedData && now - cacheTimestamp < CACHE_TTL) {
    return NextResponse.json(cachedData);
  }

  // Required data paths, if it's empty, get all data
  const requiredData: string[] = [
    'item_data.reporting_category.id',
    // 'item_data.name',
    // 'item_data.variations.0.item_variation_data.price_money.amount',
    // 'item_data.variations.0.item_variation_data.price_money.currency',
  ];

  const allItems: SquareCatalogObject[] = [];
  let cursor: string | null = null;

  try {
    // Fetch all catalog data
    do {
      const response: AxiosResponse<SquareCatalogResponse> = await axios.get(
        `${SQUARE_API_URL}/v2/catalog/list`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Square-Version': '2025-04-16',
            Authorization: `Bearer ${SQUARE_ACCESS_TOKEN}`,
          },
          params: cursor ? { cursor } : {},
        }
      );

      const { objects = [], cursor: nextCursor } = response.data;
      allItems.push(...objects);
      cursor = nextCursor ?? null;
    } while (cursor);

    // Group items by category_id
    const groupedMap: { [category_id: string]: MenuItem[] } = {};

    for (const obj of allItems) {
      if (obj.type !== 'ITEM' || obj.is_deleted) continue;

      const item: MenuItem = {};
      let categoryId = 'uncategorized';

      // If requiredData is empty, extract all available data
// If requiredData is empty, extract all available data
if (requiredData.length === 0) {
  // Extract all keys from item_data
  if (obj.item_data) {
    for (const key in obj.item_data) {
      if (obj.item_data && Object.prototype.hasOwnProperty.call(obj.item_data, key)) {
        // Type assertion to tell TypeScript that `key` is a valid key of `item_data`
        item[key as keyof typeof obj.item_data] = obj.item_data[key as keyof typeof obj.item_data];
      }
    }
  }

  // Extract reporting category id or default to 'uncategorized'
  categoryId = obj.item_data?.reporting_category?.id || 'uncategorized';
}
 else {
        // Extract specific required data
        for (const path of requiredData) {
          const val = getNested(obj, path);
          if (val !== undefined) {
            const key = path === 'item_data.reporting_category.id'
              ? 'category_id'
              : path.split('.').pop()!;

            if (key === 'category_id') categoryId = val;
            item[key] = val;
          }
        }
      }

      if (!groupedMap[categoryId]) {
        groupedMap[categoryId] = [];
      }

      groupedMap[categoryId].push(item);
    }

    // Convert to array format
    const groupedArray: GroupedCategory[] = Object.entries(groupedMap).map(
      ([category_id, items]) => ({
        category_id,
        items,
      })
    );

    // Cache the result
    cachedData = groupedArray;
    cacheTimestamp = now;

    return NextResponse.json(groupedArray);
  } catch (error: unknown) {
    const errorMessage =
      axios.isAxiosError(error)
        ? error.response?.data ?? error.message
        : error instanceof Error
        ? error.message
        : 'Unknown error';

    console.error('Square API error:', errorMessage);

    return NextResponse.json(
      { error: 'Failed to fetch from Square API', details: errorMessage },
      { status: 500 }
    );
  }
}
