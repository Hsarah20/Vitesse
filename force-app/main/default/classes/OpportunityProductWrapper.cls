public with sharing class OpportunityProductWrapper {
    @AuraEnabled public Id opportunityLineItemId { get; set; }
    @AuraEnabled public Decimal quantity { get; set; }
    @AuraEnabled public Decimal unitPrice { get; set; }
    @AuraEnabled public Decimal totalPrice { get; set; }
    @AuraEnabled public Id opportunityId { get; set; }
    @AuraEnabled public Id productId { get; set; }
    @AuraEnabled public String productName { get; set; }
    @AuraEnabled public Decimal quantityInStock { get; set; }
    @AuraEnabled public Boolean opportunityHasStockIssue { get; set; }


     // Constructeur
    public OpportunityProductWrapper(
        Id oliId, Decimal qty, Decimal unitP, Decimal totalP, 
        Id oppId, Id prodId, String prodName, Decimal qtyStock,Boolean oppHasStockIssue) {
        
        this.opportunityLineItemId = oliId;
        this.quantity = qty;
        this.unitPrice = unitP;
        this.totalPrice = totalP;
        this.opportunityId = oppId;
        this.productId = prodId;
        this.productName = prodName;
        this.quantityInStock = qtyStock;
        this.opportunityHasStockIssue=oppHasStockIssue;
    }
    // Converting a single OpportunityLineItem
    public static OpportunityProductWrapper fromOpportunityLineItem(OpportunityLineItem item) {
        if (item == null) return null;
        return new OpportunityProductWrapper(
            item.Id,
            item.Quantity,
            item.UnitPrice,
            item.TotalPrice,
            item.OpportunityId,
            item.Product2Id,
            item.Product2.Name,
            item.Product2.QuantityInStock__c,
            item.Opportunity.Has_Stock_Issue__c
        );
    }

    // Converting a List OpportunityLineItem
    public static List<OpportunityProductWrapper> fromOpportunityLineItems(List<OpportunityLineItem> lineItems) {
        List<OpportunityProductWrapper> wrappers = new List<OpportunityProductWrapper>();
    
        for (OpportunityLineItem oli : lineItems) {
            wrappers.add(fromOpportunityLineItem(oli)); 
        }

        return wrappers;
    }

}