/* eslint-disable */


/**
 * Retrieves the category name for a given list of catalog object IDs.
 * @param ids - Array of object IDs to retrieve.
 * @returns The name of the first category found or null.
 */
export const patchRetrieve = async (ids: string[]): Promise<string | null> => {
    console.log('This fn from patchRetrieve.....')
  try {
    const response = await fetch('/api/batch-retrieve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ object_ids: ids }),
    });

    const patchData = await response.json();

    const category = patchData?.related_objects?.find(
      (obj: any) => obj.type === 'CATEGORY'
    );

    return category?.category_data?.name || null;
  } catch (error) {
    console.error('Error in patchRetrieve:', error);
    return null;
  }
};
