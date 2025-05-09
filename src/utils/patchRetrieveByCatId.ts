/**
 * Retrieves the category name using a category ID via batch-retrieve API.
 * @param ids - Array of object IDs (category IDs) to retrieve.
 * @returns The name of the first category found or null.
 */
export const patchRetrieveByCatId = async (ids: string[]): Promise<string | null> => {
  
    try {
    const response = await fetch("/api/batch-retrieve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ object_ids: ids }),
    });

    const patchData = await response.json();

    const category = patchData?.objects?.[0]; // Direct access to objects array
    const categoryName = category?.category_data?.name || null;

    return categoryName;
  } catch (error) {
    console.error("Error in patchRetrieveByCatId:", error);
    return null;
  }
};
