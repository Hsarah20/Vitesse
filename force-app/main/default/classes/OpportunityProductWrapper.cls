public with sharing class OpportunityProductWrapper {
    @AuraEnabled public Id opportunityLineItemId { get; set; }
    @AuraEnabled public Decimal quantity { get; set; }
    @AuraEnabled public Decimal unitPrice { get; set; }
    @AuraEnabled public Decimal totalPrice { get; set; }
    @AuraEnabled public Decimal discount { get; set; }
    @AuraEnabled public Decimal listPrice { get; set; }
    @AuraEnabled public Id opportunityId { get; set; }
    @AuraEnabled public String opportunityName { get; set; }
    @AuraEnabled public String stageName { get; set; }
    @AuraEnabled public Date closeDate { get; set; }
    @AuraEnabled public Id productId { get; set; }
    @AuraEnabled public String productName { get; set; }
    @AuraEnabled public Decimal quantityInStock { get; set; }
    @AuraEnabled public String productCode { get; set; }

     // Constructeur
    public OpportunityProductWrapper(
        Id oliId, Decimal qty, Decimal unitP, Decimal totalP, Decimal disc, Decimal listP,
        Id oppId, String oppName, String stage, Date close,
        Id prodId, String prodName, Decimal qtyStock, String prodCode) {
        
        this.opportunityLineItemId = oliId;
        this.quantity = qty;
        this.unitPrice = unitP;
        this.totalPrice = totalP;
        this.discount = disc;
        this.listPrice = listP;
        this.opportunityId = oppId;
        this.opportunityName = oppName;
        this.stageName = stage;
        this.closeDate = close;
        this.productId = prodId;
        this.productName = prodName;
        this.quantityInStock = qtyStock;
        this.productCode = prodCode;
    }

}