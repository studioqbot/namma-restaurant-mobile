
export interface NammaSpecialItems {
    type: string,
    id: string,
    item_data: {
        name: string;
        description: string;
        is_taxable: boolean;
        category_id: string;
        tax_ids: string[]
        modifier_list_info: any[];
        image_ids?: string[] | undefined;
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
        name: string;
        url: string;
    }
}


export interface OrderDetailsType {
    id: string;
    location_id: string;
    line_items: LineItemType[];
    version: number;
    total_tax_money: {
        amount: number;
        currency: string
    };
    total_discount_money: {
        amount: number;
        currency: string
    };

    total_money: {
        amount: number;
        currency: string
    };
    total_service_charge_money: {
        amount: number;
        currency: string
    };
    net_amounts: {
        total_money: {
            amount: number;
            currency: string;
        };
        tax_money: {
            amount: number;
            currency: string;
        };
        discount_money: {
            amount: number;
            currency: string;
        };
        tip_money: {
            amount: number;
            currency: string;
        };
        service_charge_money: {
            amount: number;
            currency: string;
        }
    };

}


export const OrderDetailsValue: OrderDetailsType = {
    id: '',
    location_id: '',
    line_items: [],
    version: 0,
    total_tax_money: {
        amount: 0,
        currency: ''
    },
    total_discount_money: {
        amount: 0,
        currency: ''
    },

    total_money: {
        amount: 0,
        currency: ''
    },
    total_service_charge_money: {
        amount: 0,
        currency: ''
    },
    net_amounts: {
        total_money: {
            amount: 0,
            currency: '',
        },
        tax_money: {
            amount: 0,
            currency: '',
        },
        discount_money: {
            amount: 0,
            currency: '',
        },
        tip_money: {
            amount: 0,
            currency: '',
        },
        service_charge_money: {
            amount: 0,
            currency: '',
        }
    },

}

// export interface LineItems {
//     quantity: string;
//     catalog_object_id: string;
//     uid?: string;
//     total_money?: {
//         amount: number
//     }
//     base_price_money?: {
//         amount: number
//     }
//     modifiers? : ModifierIds[]
// }
export interface LineItemsType {
    uid?: string;
    catalog_object_id: string;
    quantity: string;
    name: string;
    variation_name?: string;
    base_price_money?: {
        amount: number;
    };
    modifiers?: ModifierType[];

    total_tax_money?: {
        amount: number;
    };
    total_discount_money?: {
        amount: number;
    };
    total_money?: {
        amount: number;
    };


}
export interface ModifierType {
    uid: string,
    base_price_money: {
        amount: 50,
    },
    total_price_money: {
        amount: 50,
    },
    name: string,
    catalog_object_id: string,
    quantity: string
}

export interface UpdateLineItems {
    uid: string;
    catalog_object_id: string;
    catalog_version: 1737096624194;
    quantity: string;
    name: string;

    item_type: string;
    total_service_charge_money: {
        amount: 0;
        currency: string;
    }
}

export interface LineItemsOrder {
    uid: string;
    catalog_object_id: string;
    quantity: 1;
    name: string;
    variation_name: string;
    base_price_money: {
        amount: number;
        currency: string
    };
    gross_sales_money: {
        amount: number;
        currency: string
    };
    total_tax_money: {
        amount: number;
        currency: string
    };
    total_discount_money: {
        amount: number;
        currency: string
    };
    total_money: {
        amount: number;
        currency: string
    };
    variation_total_price_money: {
        amount: number;
        currency: string
    }
}




export interface CategoryDataType {
    type: string;
    id: string,
    version: number,
    category_data: {
        name: string
    }
}

export const CategoryDataValue = {
    type: '',
    id: '',
    version: 0,
    category_data: {
        name: '',
    }
}

export type ModifierIds = {
    catalog_object_id: string

}
export interface CatalogItemsType {
    type: string;
    id: string;
    item_data: {
        name: string;
        description: string;
        category_id: string;
        modifier_list_info: [{
            modifier_list_id: string
        }];
        variations: [{
            type: string;
            id: string;
            item_variation_data: {
                item_id: string;
                name: string;
                ordinal: number;
                pricing_type: string;
                price_money: {
                    amount: number;
                    currency: string
                };
            }
        }
        ];
        product_type: string;

        ecom_visibility: string;
        image_ids: [
            string
        ];

    }
}
export const CatalogItemsValue = {
    type: '',
    id: '',
    item_data: {
        name: '',
        description: '',
        category_id: '',
        variations: [
            {
                type: '',
                id: '',

                item_variation_data: {
                    item_id: '',
                    name: '',
                    ordinal: 0,
                    pricing_type: '',
                    price_money: {
                        amount: 0,
                        currency: ''
                    },

                }
            }
        ],
        product_type: '',

        ecom_visibility: '',
        image_ids: [
            ''
        ],

    }
}


export type OrderCreateBody = {
    order: {
        location_id: string,
        line_items: LineItemsType[],
        pricing_options?: {
            auto_apply_taxes: boolean;
            auto_apply_discounts: boolean;
        };
        modifiers?: ModifierIds[]
    }
}

export type CatalogSearchBody = {
    query: {
        text_query: {
            keywords: string[]
        }
    }
}


export type OrderUpdateBodyAdd = {
    fields_to_clear?: string[];
    order: {
        location_id: string,
        line_items: LineItemsType[],
        pricing_options?: {
            auto_apply_taxes: boolean;
            auto_apply_discounts: boolean;
        };
        version: number
    }
}

type Money = {
    amount: number;
    currency: string;
};

export type LineItemType = {
    uid: string;
    catalog_object_id: string;
    catalog_version: number;
    quantity: string;
    name: string;
    variation_name: string;
    base_price_money: Money;
    gross_sales_money: Money;
    total_tax_money: Money;
    total_discount_money: Money;
    total_money: Money;
    variation_total_price_money: Money;
    item_type: string;
    total_service_charge_money: Money;
};

export type YourDetailsType = {
    mobile: string;
    name: string;
    email?: string;
    note?: string

}

export type Errors = {
    mobile: string;
    name: string;
    email?: string

}