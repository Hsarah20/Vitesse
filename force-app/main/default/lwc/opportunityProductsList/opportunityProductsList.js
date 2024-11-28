import { LightningElement, wire, api } from 'lwc';
import getOpportunityProducts from '@salesforce/apex/OpportunityProductController.getOpportunityProducts';
import { getRecord } from 'lightning/uiRecordApi';
import PROFILE_NAME_FIELD from '@salesforce/schema/User.Profile.Name';
import USER_ID from '@salesforce/user/Id';
const COLUMNS = [
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

export default class OpportunityProductsList extends LightningElement {
    @api recordId;
    userId = USER_ID;
    userProfileName;
    oppProducts;
    errors;
    columns = COLUMNS;
    wiredResult;

    connectedCallback(event) {
        console.log('ID ' + this.recordId)
    }
    @wire(getRecord, { recordId: '$userId', fields: [PROFILE_NAME_FIELD] })
    wiredUserProfile({ error, data }) {
        if (data) {
            this.userProfileName = data.fields.Profile.value.fields.Name.value;
            // console.log('Profil de l\'utilisateur connecté : ' + this.userProfileName);
            this.updateColumnsBasedOnProfile();
        } else if (error) {
            // console.error('Erreur lors de la récupération du profil utilisateur', error);
        }
    }

    @wire(getOpportunityProducts, { opportunityId: '$recordId' })
    wiredOpportunityProducts(result) {
        this.wiredResult = result;
        if (result.data) {
            this.oppProducts = this.formatData(result.data);
            this.errors = undefined;
        } else if (result.error) {
            this.errors = result.error;
            this.oppProducts = undefined;
            console.log("ERREURS " + errors);
        }
    }

    updateColumnsBasedOnProfile() {
        if (this.userProfileName === 'Standard User' || this.userProfileName === 'Marketing User') {
            this.columns = COLUMNS.filter(
                (column) => column.typeAttributes ? column.typeAttributes.name !== 'view' : column
            );
        } else {
            this.columns = [...COLUMNS];
        }
    }

    get hasOpportunityProducts() {
        return (this.oppProducts && this.oppProducts.length > 0);
    }

    formatData(data) {
        return data.map((row) => {
            const quantityDifference = row.quantityInStock - row.quantity;
            return {
                ...row,
                quantityClass: quantityDifference < 0 ?
                    'slds-text-color_error slds-text-title_bold' : 'slds-text-color_success slds-text-title_bold'
            };
        });
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        // console.log('ROW  ' + JSON.stringify(row));
        // console.log("ACTION NAME " + actionName);

        if (actionName === 'delete') {
            this.handleDelete(row);
        } else if (actionName === 'view') {
            this.handleView(row);
        }
    }

    handleDelete(row) {
        alert(`Le produit ${row.productName} a été supprimé.`);
    }

    handleView(row) {
        alert(`Voir les détails du produit : ${row.productName}`);
    }

}