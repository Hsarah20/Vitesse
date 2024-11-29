import { LightningElement, wire, api } from 'lwc';
import getOpportunityProducts from '@salesforce/apex/OpportunityProductController.getOpportunityProducts';
import { getRecord } from 'lightning/uiRecordApi';
import PROFILE_NAME_FIELD from '@salesforce/schema/User.Profile.Name';
import USER_ID from '@salesforce/user/Id';
import deleteOpportunityProduct from '@salesforce/apex/OpportunityProductController.deleteOpportunityProduct';
import { refreshApex } from '@salesforce/apex';
import { COLUMNS, showToast, formatData } from './utils/utils';
import { NavigationMixin } from 'lightning/navigation';

export default class OpportunityProductsList extends NavigationMixin(LightningElement) {
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
            this.oppProducts = formatData(result.data, 'slds-text-color_error slds-text-title_bold', 'slds-text-color_success slds-text-title_bold');
            this.errors = undefined;
        } else if (result.error) {
            this.errors = result.error;
            this.oppProducts = undefined;
        }
    }

    //Check if there is data
    get hasOpportunityProducts() {
        return (this.oppProducts && this.oppProducts.length > 0);
    }

    //Change the table display based on profile
    updateColumnsBasedOnProfile() {
        if (this.userProfileName === 'Standard User' || this.userProfileName === 'Marketing User') {
            this.columns = COLUMNS.filter(
                (column) => column.typeAttributes ? column.typeAttributes.name !== 'view' : column
            );
        } else {
            this.columns = [...COLUMNS];
        }
    }

    //Handler delete && view actions
    handleRowAction(event) {
        if (event.detail.action.name === 'delete') {
            this.handleDelete(event.detail.row);
        } else if (event.detail.action.name === 'view') {
            this.handleView(event.detail.row);
        }
    }

    //Delete a product line with the id
    handleDelete(row) {
        deleteOpportunityProduct({ OpportunityLineItemId: row.opportunityLineItemId })
            .then((result) => {
                refreshApex(this.wiredResult)
                showToast('Succès', result, 'success');
            })
            .catch((error) => {
                showToast('Erreur', error.body.message, 'error');
            })
    }

    //Show the details of a product line
    handleView(row) {
        this.navigateToOpportunityProductDetail(row.opportunityLineItemId);
    }

    //Redirect to the component page. 
    navigateToOpportunityProductDetail(id) {
        console.log('Navigating to OpportunityProductDetail with ID:', id);
        this[NavigationMixin.Navigate]({
            type: 'standard__component',
            attributes: {
                componentName: 'c__opportunityProductDetail',
            },
            state: {
                c__recordId: id
            }
        });
        console.log('Navigation command executed.');
    }

}