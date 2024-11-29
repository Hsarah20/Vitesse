import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export const COLUMNS = [
    { label: 'Nom du produit', fieldName: 'productName', type: 'text' },
    {
        label: 'Quantité',
        fieldName: 'quantity',
        type: 'number',
        cellAttributes: {
            class: { fieldName: 'quantityClass' }
        }
    },
    { label: 'Prix unitaire', fieldName: 'unitPrice', type: 'currency' },
    { label: 'Prix total', fieldName: 'totalPrice', type: 'currency' },
    { label: 'Quantité en stock', fieldName: 'quantityInStock', type: 'number' },
    {
        label: 'Supprimer',
        type: 'button-icon',
        typeAttributes: {
            iconName: 'utility:delete',
            name: 'delete',
            alternativeText: 'Supprimer',
            variant: 'border-filled',
            iconClass: 'slds-icon-text-error'
        }
    },
    {
        label: 'Voir produit',
        type: 'button',
        typeAttributes: {
            iconName: 'utility:preview',
            name: 'view',
            label: 'View Product',
            variant: 'brand',
            alternativeText: 'Voir le produit'
        }
    }

];

export function showToast(title, message, variant) {
    const evt = new ShowToastEvent({
        title: title,
        message: message,
        variant: variant
    });
    this.dispatchEvent(evt);
}
export function formatData(data, classError, classSuccess) {
    return data.map((row) => {
        const quantityDifference = row.quantityInStock - row.quantity;
        return {
            ...row,
            quantityClass: quantityDifference < 0 ? classError : classSuccess
        };
    });
}