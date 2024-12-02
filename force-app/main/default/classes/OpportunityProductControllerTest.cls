@isTest
public with sharing class OpportunityProductControllerTest {
    
    private static void setupTestData() {
        Account acc = new Account(Name = 'Test Account');
        insert acc;
        Opportunity opp = new Opportunity(
            Name = 'Test Opportunity',
            StageName = 'Prospecting',
            CloseDate = Date.today().addDays(30),
            AccountId = acc.Id
        );
        insert opp;

        Product2 product = new Product2(Name = 'Test Product', IsActive = true);
        insert product;

        Pricebook2 pricebook = [SELECT Id FROM Pricebook2 WHERE IsStandard = true LIMIT 1];

        PricebookEntry pbe = new PricebookEntry(
            Product2Id = product.Id,
            Pricebook2Id = pricebook.Id,
            UnitPrice = 100.0,
            IsActive = true
        );
        insert pbe;

        OpportunityLineItem oli = new OpportunityLineItem(
            OpportunityId = opp.Id,
            PricebookEntryId = pbe.Id,
            Quantity = 2,
            UnitPrice = 100.0
        );
        insert oli;
    }
    @IsTest
    static void testGetOpportunityProducts() {
        setupTestData();
        
        Opportunity opp = [SELECT Id FROM Opportunity LIMIT 1];

        Test.startTest();
        List<OpportunityProductController.OpportunityProductWrapper> result = 
            OpportunityProductController.getOpportunityProducts(opp.Id);
        Test.stopTest();

        System.assertNotEquals(null, result, 'La liste des Opportunity Products ne doit pas être null.');
        System.assertEquals(1, result.size(), 'La liste des Opportunity Products doit contenir 1 élément.');
    }

    @IsTest
    static void testDeleteOpportunityProduct() {
        setupTestData();
    
        OpportunityLineItem oli = [SELECT Id FROM OpportunityLineItem LIMIT 1];

        Test.startTest();
        String result = OpportunityProductController.deleteOpportunityProduct(oli.Id);
        Test.stopTest();

      
        System.assertEquals('L\'Opportunity Product a été supprimé avec succès.', result, 
            'Le message de succès doit être retourné après la suppression.');

        OpportunityLineItem deletedOLI = [SELECT Id FROM OpportunityLineItem WHERE Id = :oli.Id LIMIT 1];
        System.assertEquals(null, deletedOLI, 'L\'OpportunityLineItem doit être supprimé.');
    }

    @IsTest
    static void testDeleteOpportunityProductWithNullId() {
        Test.startTest();
        try {
            OpportunityProductController.deleteOpportunityProduct(null);
            System.assert(false, 'Une exception devrait être levée si l\'ID est null.');
        } catch (AuraHandledException e) {
            System.assertEquals('L\'ID de l\'Opportunity Product ne peut pas être null.', e.getMessage(),
                'Le message d\'exception doit indiquer que l\'ID ne peut pas être null.');
        }
        Test.stopTest();
    }

}