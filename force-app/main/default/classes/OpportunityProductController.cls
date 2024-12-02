public with sharing class OpportunityProductController {
    @AuraEnabled(cacheable=true)
    public static List<OpportunityProductWrapper> getOpportunityProducts(ID opportunityId) {
        // Request SOQL
        List<OpportunityLineItem> opportunityLineItems = [
            SELECT Id, Quantity, UnitPrice, TotalPrice, Discount, ListPrice,
                   Opportunity.Id, Opportunity.Name, Opportunity.StageName, Opportunity.CloseDate,
                   Product2.Id, Product2.Name, Product2.QuantityInStock__c, Product2.ProductCode
            FROM OpportunityLineItem
            WHERE Opportunity.Id = :opportunityId
        ];
        
        return OpportunityProductWrapper.fromOpportunityLineItems(opportunityLineItems);
    }

    @AuraEnabled
    public static string deleteOpportunityProduct(ID OpportunityLineItemId){
        if (opportunityLineItemId == null) {
            throw new AuraHandledException('L\'ID de l\'Opportunity Product ne peut pas être null.');
        }
        OpportunityLineItem opportunityLineItem = [
            SELECT Id
            FROM OpportunityLineItem
            WHERE Id = :opportunityLineItemId
            LIMIT 1
        ];

        try {        
            Database.DeleteResult result = Database.delete(opportunityLineItem, false);
            if (result.isSuccess()) {
                return 'L\'Opportunity Product a été supprimé avec succès.';
            } else {
                throw new AuraHandledException('Erreur lors de la suppression : ' + result.getErrors()[0].getMessage());
            }
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    } 
}