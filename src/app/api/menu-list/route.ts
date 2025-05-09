import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosResponse } from 'axios';

const SQUARE_API_URL = process.env.NEXT_PUBLIC_APP_SQUARE_API_URL;
const SQUARE_ACCESS_TOKEN = process.env.NEXT_PUBLIC_APP_SQUARE_ACCESS_TOKEN_PROD;

let cachedData: any = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

interface SquareCatalogObject {
  type: string;
  id?: string;
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

  const allItems: SquareCatalogObject[] = [];
  let cursor: string | null = null;

  try {
    // Step 1: Use cursor to fetch all catalog items
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

    // Step 2: Extract unique category_ids from ITEMs
    const categoryIdSet = new Set<string>();

    for (const obj of allItems) {
      if (obj.type === 'ITEM' && !obj.is_deleted) {
        const id = obj.item_data?.reporting_category?.id;
        if (id) categoryIdSet.add(id);
      }
    }

    const category_ids = Array.from(categoryIdSet);
    if (category_ids.length === 0) {
      return NextResponse.json({ objects: allItems, total_length: allItems.length });
    }

    // Step 3: Call batch-retrieve to get full category objects
    const batchResponse = await axios.post(
      `${SQUARE_API_URL}/v2/catalog/batch-retrieve`,
      {
        object_ids: category_ids,
        include_related_objects: true,
        include_category_path_to_root: true,
        include_deleted_objects: false,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Square-Version': '2025-04-16',
          Authorization: `Bearer ${SQUARE_ACCESS_TOKEN}`,
        },
      }
    );

    const allObjects = batchResponse.data.objects || [];

    // Step 4: Filter only CATEGORY objects
    const categories = allObjects.filter((obj: any) => obj.type === 'CATEGORY' && !obj.is_deleted);

    // Step 5: Map filtered categories to include id and category_data.name
    const categoryList = categories.map((category: any) => ({
      category_id: category.id,
      category_name: category.category_data?.name,
    }));

    // Step 6: If categoryList is empty, return all items (original data)
    if (categoryList.length === 0) {
      return NextResponse.json({ objects: allItems, total_length: allItems.length });
    }

    // Step 7: Cache and return the filtered data with total length
    cachedData = { categoryList, total_length: categoryList.length };
    cacheTimestamp = now;

    return NextResponse.json({ categoryList, total_length: categoryList.length });
  } catch (error: unknown) {
    const errorMessage =
      axios.isAxiosError(error)
        ? error.response?.data ?? error.message
        : error instanceof Error
        ? error.message
        : 'Unknown error';

    console.error('Square API error:', errorMessage);

    return NextResponse.json(
      { error: 'Failed to fetch category data from Square API', details: errorMessage },
      { status: 500 }
    );
  }
}
