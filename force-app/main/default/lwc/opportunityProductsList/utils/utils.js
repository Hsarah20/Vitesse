import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import PRODUCT_NAME from '@salesforce/label/c.Product_Name';
import UNIT_PRICE from '@salesforce/label/c.Unit_Price';
import NO_PRODUCTS from '@salesforce/label/c.No_Products';
import NO_PRODUCTS_1 from '@salesforce/label/c.No_products_1';
import NO_PRODUCTS_2 from '@salesforce/label/c.No_products_2';
import QUANTITY from '@salesforce/label/c.Quantity';
import TOTAL_PRICE from '@salesforce/label/c.Total_Price';
import QUANTITY_IN_STOCK from '@salesforce/label/c.Quantity_in_stock';
import DELETE from '@salesforce/label/c.Delete';
import SEE_PRODUCT from '@salesforce/label/c.See_product';
import OPP_PRODUCTS from '@salesforce/label/c.Opp_Products';
import ERROR_QUANTITY from '@salesforce/label/c.Error_quantity';
import ERROR_QUANTITY_2 from '@salesforce/label/c.Error_quantity_2';
import UPDATE_PROBLEM_OPP from '@salesforce/label/c.Update_problem_Opp';


export const COLUMNS = [
    { label: PRODUCT_NAME, fieldName: 'productName', type: 'text' },
    {
        label: QUANTITY,
        fieldName: 'quantity',
        type: 'number',
        cellAttributes: {
            class: { fieldName: 'quantityClass' },
            style: { fieldName: 'bgColor' },
        }
    },
    { label: UNIT_PRICE, fieldName: 'unitPrice', type: 'currency' },
    { label: TOTAL_PRICE, fieldName: 'totalPrice', type: 'currency' },
    { label: QUANTITY_IN_STOCK, fieldName: 'quantityInStock', type: 'number' },
    {
        label: DELETE,
        type: 'button-icon',
        typeAttributes: {
            iconName: 'utility:delete',
            name: 'delete',
            alternativeText: DELETE,
            variant: 'border-filled',
            iconClass: 'slds-icon-text-error'
        }
    },
    {
        label: SEE_PRODUCT,
        type: 'button',
        typeAttributes: {
            iconName: 'utility:preview',
            name: 'view',
            label: SEE_PRODUCT,
            variant: 'brand',
            alternativeText: SEE_PRODUCT
        }
    }

];

export function showToast(title, message, variant) {
    const evt = new ShowToastEvent({
        title: title,
        message: message,
        variant: variant
    });
    dispatchEvent(evt);
}
export function formatData(data, classError, classSuccess, bgColorError, bgColorSuccess) {
    return data.map((row) => {
        const quantityDifference = row.quantityInStock - row.quantity;
        return {
            ...row,
            quantityClass: quantityDifference < 0 ? classError : classSuccess,
            bgColor: quantityDifference < 0 ? bgColorError : bgColorSuccess
        };
    });
}

export const labels = {
    noProducts: NO_PRODUCTS,
    noProductsOne: NO_PRODUCTS_1,
    noProductsTwo: NO_PRODUCTS_2,
    oppProducts: OPP_PRODUCTS,
    errorQuantity: ERROR_QUANTITY,
    errorQuantityTwo: ERROR_QUANTITY_2,
    updateProblemOpp: UPDATE_PROBLEM_OPP,
}