export interface NammaSpecialItems {
    type: string,
    id: string,
    item_data: {
        name: string;
        description: string;
        is_taxable: boolean;
        category_id: string;
        tax_ids: string[]
        modifier_list_info: Modifier[];
        image_ids? : string[] | undefined;
        variations: [
            {
                id: string
                item_variation_data: {
                    item_id: string;
                    name: string
                    ordinal: number;
                    pricing_type: string;
                    price_money: {
                        amount: number
                    },

                }
            }
        ],


    }
}

export interface ImageType {
    id: string;
    image_data: {
        name :string;
        url: string ;
    }
}

interface Modifier {
    modifier_list_id: string;
    min_selected_modifiers: number;
    max_selected_modifiers: number;
    enabled: true
}


