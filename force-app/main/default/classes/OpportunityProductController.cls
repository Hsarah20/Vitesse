public with sharing class OpportunityProductController {
    @AuraEnabled(cacheable=true)
    public static List<OpportunityProductWrapper> getOpportunityProducts(ID opportunityId) {
        // Requête SOQL pour récupérer les données nécessaires
        List<OpportunityLineItem> opportunityLineItems = [
            SELECT Id, Quantity, UnitPrice, TotalPrice, Discount, ListPrice,
                   Opportunity.Id, Opportunity.Name, Opportunity.StageName, Opportunity.CloseDate,
                   Product2.Id, Product2.Name, Product2.QuantityInStock__c, Product2.ProductCode
            FROM OpportunityLineItem
            WHERE Opportunity.Id = :opportunityId
        ];
        
        // Préparer une liste de résultats structurés
        List<OpportunityProductWrapper> results = new List<OpportunityProductWrapper>();
        
        // Parcourir les lignes de produits et structurer les résultats
        for (OpportunityLineItem oli : opportunityLineItems) {
            results.add(new OpportunityProductWrapper(
                oli.Id,
                oli.Quantity,
                oli.UnitPrice,
                oli.TotalPrice,
                oli.Discount,
                oli.ListPrice,
                oli.Opportunity.Id,
                oli.Opportunity.Name,
                oli.Opportunity.StageName,
                oli.Opportunity.CloseDate,
                oli.Product2.Id,
                oli.Product2.Name,
                oli.Product2.QuantityInStock__c,
                oli.Product2.ProductCode
            ));
        }
        
        return results;
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

        System.debug('opportunityLineItem ' +opportunityLineItem);

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