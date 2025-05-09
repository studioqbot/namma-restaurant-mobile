/* eslint-disable */
import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosResponse } from 'axios';

const SQUARE_API_URL = process.env.NEXT_PUBLIC_APP_SQUARE_API_URL;
const SQUARE_ACCESS_TOKEN = process.env.NEXT_PUBLIC_APP_SQUARE_ACCESS_TOKEN_PROD;

// Simple in-memory cache
let cachedData: any = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

function getNested(obj: any, path: string): any {
  return path.split('.').reduce((o, key) => {
    if (o === undefined || o === null) return undefined;
    return Array.isArray(o) && !isNaN(Number(key)) ? o[Number(key)] : o[key];
  }, obj);
}

interface SquareCatalogObject {
  type: string;
  is_deleted?: boolean;
  item_data?: {
    reporting_category?: { id?: string };
    name?: string;
    ecom_image_uris?: string[];
    variations?: {
      item_variation_data?: {
        price_money?: {
          amount?: number;
          currency?: string;
        };
      };
      custom_attribute_values?: any;
    }[];
  };
}

interface SquareCatalogResponse {
  objects?: SquareCatalogObject[];
  cursor?: string | null;
}

interface MenuItem {
  [key: string]: any;
}

// Replace with your actual custom attribute key
const HOTSELLING_CUSTOM_ATTRIBUTE_KEY = 'Square:41d1d16b-e6b0-46b0-af4d-4b044b5e02b2';

export async function GET(_req: NextRequest): Promise<NextResponse> {
  if (!SQUARE_API_URL || !SQUARE_ACCESS_TOKEN) {
    return NextResponse.json(
      { error: 'Missing Square configuration in environment variables' },
      { status: 500 }
    );
  }

  const now = Date.now();
  if (cachedData && now - cacheTimestamp < CACHE_TTL) {
    return NextResponse.json(cachedData);
  }

  const requiredData: string[] = [
    'item_data.reporting_category.id',
    'item_data.name',
    'item_data.variations.0.item_variation_data.price_money.amount',
    'item_data.variations.0.item_variation_data.price_money.currency',
    `item_data.variations.0.custom_attribute_values.${HOTSELLING_CUSTOM_ATTRIBUTE_KEY}`,
    'item_data.ecom_image_uris',
  ];

  const allItems: SquareCatalogObject[] = [];
  const menuItems: MenuItem[] = [];
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

    // Process and filter items
    for (const obj of allItems) {
      if (obj.type !== 'ITEM' || obj.is_deleted) continue;

      const variations = obj.item_data?.variations;
      const customAttributes =
        variations?.[0]?.custom_attribute_values?.[HOTSELLING_CUSTOM_ATTRIBUTE_KEY];

      if (!customAttributes?.boolean_value) continue; // skip if not hot selling

      const item: MenuItem = {};

      for (const path of requiredData) {
        const val = getNested(obj, path);
        if (val !== undefined) {
          const key = path === 'item_data.reporting_category.id'
            ? 'category_id'
            : path.split('.').pop()!;

          item[key] = (key === 'amount' && typeof val === 'number')
            ? `$ ${(val / 100).toFixed(2)}`
            : val;
        }
      }

      menuItems.push(item);
    }

    const responseData = {
      total_items: menuItems.length,
      hot_selling_items: menuItems,
    };

    cachedData = responseData;
    cacheTimestamp = now;

    return NextResponse.json(responseData);
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
