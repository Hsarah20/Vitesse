import { LightningElement, wire, api } from 'lwc';
import getOpportunityLineItemDetails from '@salesforce/apex/OpportunityProductController.getOpportunityLineItemDetails';
import { CurrentPageReference } from 'lightning/navigation';

export default class OpportunityProductDetail extends LightningElement {
    @api recordId;
    opportunityLineItem;
    error = false;

    connectedCallback(event) {
        console.log('ID OPPORTUNITY DETAIL ' + this.recordId)
    }

    @wire(CurrentPageReference)
    currentPageReference({ state }) {
        if (state && state.c__recordId) {
            this.recordId = state.c__recordId;
            console.log('Record ID:', this.recordId);
        }
    }

    // @wire(getOpportunityLineItemDetails, { id: '$recordId' })
    // wiredOpportunityLineItemDetails(result) {
    //     if (result.data) {
    //         this.opportunityLineItem = result.data;
    //         console.log('DATA', JSON.stringify(result.data))
    //         this.error = false;
    //     } else if (result.error) {
    //         console.error('Erreur lors de la récupération des détails:', result.error);
    //         this.error = true;
    //     }
    // }
}