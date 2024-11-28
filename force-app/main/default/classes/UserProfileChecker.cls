public with sharing class UserProfileChecker {
    @AuraEnabled(cacheable=true)
    public static String getUserProfileType() {
        // retrieve current user
        User currentUser = [SELECT Profile.Name FROM User WHERE Id = :UserInfo.getUserId()];
        if (currentUser.Profile.Name == 'System administrator') {
            return 'ADMIN';
        } else if (currentUser.Profile.Name == 'Marketing User'||currentUser.Profile.Name =='Standard User') {
            return 'COMM';
        } else {
            return 'OTHER';
        }
    }
}