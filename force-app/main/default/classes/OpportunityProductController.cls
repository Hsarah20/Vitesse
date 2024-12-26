public with sharing class OpportunityProductController {
    @AuraEnabled(cacheable=true)
    public static List<OpportunityProductWrapper> getOpportunityProducts(ID opportunityId) {
        // Request SOQL
        List<OpportunityLineItem> opportunityLineItems = [
            SELECT Id, Quantity, UnitPrice, TotalPrice, 
                   Opportunity.Id, Opportunity.Has_Stock_Issue__c,
                   Product2.Id, Product2.Name, Product2.QuantityInStock__c
            FROM OpportunityLineItem
            WHERE Opportunity.Id = :opportunityId
        ];
        
        return OpportunityProductWrapper.fromOpportunityLineItems(opportunityLineItems);
    }

    @AuraEnabled
    public static string deleteOpportunityProduct(ID OpportunityLineItemId){
        if (opportunityLineItemId == null) {
            throw new AuraHandledException(Label.delete_opp_null);
        }
        OpportunityLineItem opportunityLineItem ;

        try {
            opportunityLineItem = [
                SELECT Id
                FROM OpportunityLineItem
                WHERE Id = :opportunityLineItemId
                LIMIT 1
            ];
        } catch (QueryException e) {
            throw new AuraHandledException(Label.Delete_Opp_Not_found);
        }
        
        try {
         
            Database.DeleteResult result = Database.delete(opportunityLineItem, false);
            if (result.isSuccess()) {
                return Label.Delete_Success;
            } else {
                throw new AuraHandledException(Label.Delete_Opp_Error + result.getErrors()[0].getMessage());
            }
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    } 

    @AuraEnabled
    public static void clearHasStockIssueField(Id opportunityId) {
        Opportunity opp = [SELECT Id, Has_Stock_Issue__c FROM Opportunity WHERE Id = :opportunityId LIMIT 1];
        opp.Has_Stock_Issue__c = false;
        update opp;
    }
}