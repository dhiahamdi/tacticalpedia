export const locale = {
    lang: 'en',
    data: {
        'ERROR':{
            'EMAIL_NOT_FOUND': 'Email not found!',
            'INVALID_PASSWORD': 'Invalid password!',
            'USERNAME_TAKEN': 'Username already existing',
            'EMAIL_TAKEN': 'Email already existing',
            'ACCOUNT_NOT_FOUND': 'Account not found',
            'EMAIL_NOT_VERIFIED': 'Account not verified',
            'GENERIC_ERROR' : 'Something went wrong. Please try again.',
            'CONFIRM_EMAIL_NOT_SENT' : 'Error when sending confirmation e-mail ',
            'GENERIC_ERROR_MESSAGE': 'There was an error with your request. Please try again or contact our support center.',
            'MISSING_BILLING_INFO': 'You must add your billing information before you can make a subscription',
            'FILE_SIZE_EXCEEDED': 'This file can\'t be uploaded because it\'s too big.',
            'FILE_UPLOAD_GENERIC': 'This file can\'t be uploaded'
        },

        'SHARED':{
            'NO_MAIL': 'Email is required',
            'VALID_MAIL': 'Please enter a valid email address',
            'NO_PASSWORD': 'Password is required',
            'PASSWORD_LENGTH': 'Password must be at least 8 characters long',
            'BACK': 'Back',
            'NO_USERNAME': 'Username is required!',
            'USERNAME_MINIMUM_LENGTH' : "Username must be at least 8 characters long.",
            'CONFIRM': 'Confirm',
            'CONFIRM_PASSWORD': 'Confirm password',
            'NO_CONFIRM_PASSWORD': 'Password confirmation is required!',
            'NO_PASSWORD_MATCH': 'Passwords are not matching!',
            'NEXT': 'Next',
            'PROFILE': 'Profile',
            'NAME': 'Name',
            'NO_NAME': 'Name is required!',
            'SURNAME': ' Surname',
            'NO_SURNAME': 'Surname is required!',
            'ADDRESS': 'Address(optional)',
            'DISCIPLINE': 'Discipline',
            'NO_DISCIPLINE': 'Discipline is required!',
            'ROLE': 'Role',
            'NO_ROLE': 'Role is required!',
            'QUALIFICATION': 'Qualification',
            'NO_QUALIFICATION': 'Qualification is required!',
            'DONE': 'Done',
            'CLOSE': 'Close',
            'PASSWORD': 'Password',
            'GO_BACK_TO_LOGIN': 'Go back to login',
            'UPDATE': 'Update',
            'CHOOSE_PIC': 'Choose picture',
            'OR': 'or pay with',
            'DELETE': 'Delete',
            'CANCEL': 'Cancel', // Annulla
            'LOGIN_OR_SIGNUP': 'Login or signup',
            'NO_RESULTS_FOUND': 'There are no results for these search criteria',
            'ALL': 'Tutte',
            'THEME_OPTIONS': 'Theme options',
            'MANAGE_PROFILE': 'Manage profile',
            'CUSTOMIZE': 'Customize',
            'LOGOUT': 'Logout'

            //

        },

        'LOGIN': {
            'TITLE': 'LOGIN TO YOUR ACCOUNT',
            'REMEMBER': 'Remember Me',
            'FORGOT': 'Forgot Password?',
            'NO_ACC': "Don't have an account?",
            'CREATE': 'Create an account',
            'EMAIL_CONFIRMED': 'Your email has been confirmed',
            'SEND_CONFIRM': 'Send confirm e-mail again',
            'CONFIRM_EMAIL_SENT' : 'Confirmation e-mail sent with success'
        },
        'GROUP': {
            'INSERT-FORM':{
                'TITLE': 'New coaching room',
                'ADD-BTN': 'create coaching room',
                'ADD-AUTHOR': 'Add Author',
                'NAME': 'Coaching Room Title',
                'DESCRIPTION': 'Description',
                'SERVICE': 'Service',
                'POLICY': 'Policy',
                'TYPOLOGY': 'Typology',
                'AUTHORS': 'Authors',
                'USER': 'User e-mail',
                'IMAGE': 'Coaching Room Image',

            }
        },

        'FORGOT':{
            'TITLE': 'RECOVER YOUR PASSWORD',
            'LINK': 'SEND RESET LINK',
            'EMAIL_SENT': "We've sent a link to your email address. Please click on that to reset your password.",
            'PASSWORD_REQUIRED' : 'Password is required',
            'PASSWORD_CONFIRM': 'Password (Confirm)',
            'PASSWORD_CONFIRM_REQUIRED': 'Password confirmation is required',
            'PASSWORD_MUST_MATCH': 'Passwords must match',
            'RESET_MY_PASSWORD': 'RESET MY PASSWORD'
        },

        'SIGNUP':{
            'TITLE': 'CREATE AN ACCOUNT',
            'READ': 'I read and accept',
            'TERMS': 'terms and conditions',
            'ACCEPT': 'Accept terms and conditions',
            'CREATE': 'Create Account',
            'CONFIRM': 'We have sent a confirmation mail.',
            'TO_LOGIN': 'Back to Login',
            'ACCOUNT_ALREADY': 'Already have an account?',
            'LOGIN': 'Login',
            'EMAIL_ALREADY_TAKEN': 'This email is already taken',
            'USERNAME_ALREADY_TAKEN': 'This username is already taken'

        },

        'RESET':{
            'TITLE': 'RESET YOUR PASSWORD',
            'SUCCESS_MESSAGE': 'Password changed correctly',
            'INVALID_PASSWORD': 'The old password is wrong'

        },

        'UPDATE_PASSWORD': {
            'CHANGE_PASSWORD': 'CHANGE YOUR PASSWORD',
            'CHANGE_PASSWORD_CAPITALIZED': 'Change your password',
            'OLD_PASSWORD': 'Old password',
            'OLD_PASSWORD_REQUIRED': 'Old Password is required',
            'NEW_PASSWORD': 'New password',
            'NEW_PASSWORD_REQUIRED': 'New Password is required',
            'NEW_PASSWORD_CONFIRM': 'New password (confirm)',
            'NEW_PASSWORD_CONFIRM_REQUIRED': 'New Password confirmation is required',

        },

        'PROFILE': {
            'UPDATE_PROFILE': 'Update Profile',
            'NAME': 'Name',
            'NAME_REQUIRED': 'Name is required!',
            'SURNAME': 'Surname',
            'SURNAME_REQUIRED': 'Surname is required!',
            'ADDRESS': 'Address',
            'ADDRESS_REQUIRED': 'Address field is required',
            'CITY': 'City',
            'CITY_REQUIRED': 'City field is required',
            'ZIP': 'Zip code',
            'ZIP_REQUIRED': 'ZIP field is required',
            'STATE': 'State',
            'STATE_REQUIRED': 'State field is required',
            'COUNTRY': 'Country',
            'COUNTRY_REQUIRED': 'Country field is required',
            'DISCIPLINE': 'Discipline',
            'DISCIPLINE_REQUIRED': 'Discipline is required!',
            'ROLE': 'Role',
            'ROLE_REQUIRED': 'Role is required!',
            'QUALIFICATION': 'Qualification',
            'QUALIFICATION_REQUIRED': 'Qualification is required!',
            'EDIT_BILLING_INFO': 'Edit billing info',
            'BILLING_INFO_UPDATED': 'Billing info updated correctly',
            'USER_TYPE': 'User type',
            'USER_TYPE_REQUIRED': 'User type field is required',
            'PRIVATE': 'Private',
            'COMPANY': 'Company',
            'COMPANY_NAME': 'Company',
            'COMPANY_NAME_REQUIRED': 'Company field is required',
            'CODICE_FISCALE': 'Tax code',
            'CODICE_FISCALE_REQUIRED': 'Tax code field is required',
            'P_IVA': 'VAT number',
            'P_IVA_REQUIRED': 'VAT field is required',
            'GENERAL_INFO': 'General Information',
        },

        //LIST FOR PROFILE FIELDS
        'DISCIPLINES': {

            'footbal' : 'Football',
            'basketball' : 'BasketBall',
            'volleyball' : 'Volleyball',
            'rugby' : 'Rugby',
            'boating' : 'Boating',
            'gymnastics' : 'Gymnastics',
            'other' : 'Other'
        },

        'ROLES': {
            'trainer': 'Trainer',
            'preparer': 'Preparer',
            'professional': 'Professional',
            'athlete': 'Athlete',
            'manager': 'Manager',
            'agent': 'Agent',
            'passionate': 'Passionate',
            'parent': 'Parent',
            'other': 'Other'
        },

        'QUALIFICATIONS': {
            'uefa_pro_trainer': 'Uefa Pro Trainer',
            'uefa_a_trainer': 'Uefa A trainer',
            'uefa_b_trainer': 'Uefa B trainer',
            'uefa_c_trainer': 'Uefa C trainer',
            'uefa_d_trainer': 'Uefa D trainer',
            '5_a_side_football_coach_1st_level': '5 a side Footbal coach 1st level',
            '5_a_side_football_coach_2nd_level': '5 a side Footbal coach 2nd level',
            'professional_athletic_trainer': 'Professionale Athletic Trainer',
            'professional_goalkeeper_trainer': 'Professional Goalkeeper Trainer',
            'sports_directors': 'Sports Director',
            'responsible_for_the_youth_sector': 'Responsible for the youth sector',
            'other': 'Other'
        },


        //SUBSCRIPTION
        'MANAGE_SUBSCRIPTION':{
            'TITLE': 'Manage Subscription',
            'PAYMENT_SUCCESS': 'The payment has been successful.',
            'PAST_DUE_MESSAGE': 'We couldn\'t process your last payment, please update your payment method or you will lose access to your trainings'
        },

        'CREATE_SUBSCRIPTION':{
            'TITLE': 'Subscribe to TacticalPedia',
            'FREE': 'FREE',
            'MONTHLY': 'MONTHLY',
            'YEARLY': 'YEARLY',
            'COMPANY': 'COMPANY',
            'CANCEL_SUBSCRIPTION': 'CANCEL SUBSCRIPTION',
            'PAYPAL_CANCEL_SUCCESS_MESSAGE': 'Your subscription has been canceled, you can use Tacticalpedia until the end of the current subscription period.'
        },

        'STRIPE':{
            'PAY': 'PAY WITH STRIPE'
        },

        //TRAINING
        'MANAGE_INSERT':{
            'INSERT_NEW': 'Draw a new training',
            'START_FROM_DRAFT': 'Or start from a draft'
        },

        'INSERT_TRAINING':{
            'TITLE_EDIT': 'Edit Training',
            'TITLE': 'New Training',
            'DESIGN': 'Design',
            'PLANNING': 'Planning',
            'DEFINITION': 'Definition',
            'DEVELOPMENT': 'Development',
            'GOAL': 'Goal',
            'STRATEGY': 'Strategy',
            'FOCUS': 'Focus',
            'DESCRIPTION': 'Description',
            'VARIANTS': 'Variants',
            'NAME': 'Proposal Name',
            'CATEGORY': 'Category',
            'TYPE': 'Type',
            'CONTENTS': 'Contents',
            'GOALS': 'Goals',
            'PLAYERS': 'Players',
            'SPACE': 'Space',
            'TIME': 'Time',
            'REPETITIONS': 'Repetitions',
            'RECOVER': 'Recover',
            'INTENSITY': 'Intensity',
            'VISIBILITY': 'Visibility',
            'OBSERVATIONS': 'Methodological Observation',
            'DEVELOPEMENTS': 'Potential developement',
            'NOTES': 'Notes',
            'PUBLIC': 'Public',
            'PRIVATE': 'Private',
            'CREATE': 'Create',
            'DEFAULT_TAX': 'Taxonomies',
            'CUSTOM_TAX': 'Custom Taxonomies',
            'DEFAULT_OPT': 'Properties',
            'CUSTOM_OPT': 'Custom Properties',
            'DRAG_AND_DROP': 'Drag & Drop',
            'OR': 'or',
            'CLICK_TO_BROWSE': 'Click to browse files',
            'IMAGE_VIDEO': 'Images/Videos',
            'FILES': 'Files',
            'UPDATE': 'Update',


        },

        'INSERT_DRAFT':{
            'TITLE': 'New Draft',
            'NAME': 'Proposal name',
            'CATEGORY': 'Category',
            'DESCRIPTION': 'Description',
            'NO_CATEGORY': 'Category is required!',
            'CREATE': 'Create',
            'DESCR_OR_IMG_ERROR': 'One between description or picture is required!',
            'SUCCESS_MESSAGE': 'Draft created correctly'
        },

        'TRAINING_LIBRARY':{
            'TITLE': 'Training Library',
            'PUBLIC': 'Public',
            'PRIVATE': 'Private',
            'NEW': 'Add new training',
            'CATEGORIES': 'CATEGORIES',
            'NO_TRAININGS': 'No Trainings',
            'SEARCH_PLACEHOLDER': 'Search',
            'CATEGORY': 'Category',
            'ALL': 'All',
            'WARNING_DELETE_MESSAGE': "Are you sure you want to delete these trainings?",
            'FILTERS': 'Filters',
            'RESET_FILTERS': 'Reset filter',

        },

        'TRAINING_DETAIL': {
            'SELECT_TRAINING_TO_READ': 'Select a traning to display',
            'PLAYERS': 'Players',
            'TIME': 'Time',
            'SPACE': 'Space',
            'RECOVER': 'Recover',
            'REPETITIONS': 'Repetitions',
            'INTENSITY': 'Intensity',
            'DESCRIPTION': 'Description',
            'IMAGE_GALLERY': 'Image Gallery',
            'DETAILS': 'DETAILS',
            'ATTACHMENTS': 'Attachments',
        },

        'SINGLE_TRAINING': {

            'DETAILS': 'Details',
            'TAXONOMIES': 'Taxonomies',
            'FLOW': 'Flow',
            'FROM': 'by',
            'CREATE_PDF': 'CREATE PDF',
            'TEXT_TAXONOMIES': 'Textual Taxonomies',
            'CATEGORY_AND_OPTIONS': 'Category & Options',
            'CATEGORY': 'Category',
            'DESCRIPTION': 'Description',
            'OBSERVATIONS': 'Observations',
            'VARIANTS': 'Variants'

        },

        'CUSTOMIZE_TRAINING': {
            'TITLE': 'Customize training details',
            'CATEGORIES': 'CATEGORIES',
            'CUSTOM_CATEGORIES': 'Custom categories',
            'CUSTOM_CATEGORIES_DESC': 'Here you can change the categories of your proposals, they are usually categories like "Under 18"...',
            'CUSTOM_TEXT_FIELDS': 'Custom text fields',
            'CUSTOM_TEXT_FIELDS_DESC': 'Here you can add specific values in your proposals , for instance the number of players, time needed...',
            'TAXONOMIES': 'Taxonomies',
            'CUSTOM_SELECT_TAXONOMIES': 'Custom select taxonomies',
            'CUSTOM_SELECT_TAXONOMIES_DESC': 'Here you can change the categories of your proposals, and you will be able to filter them later using these taxonomies',
            'ADD_NEW_CATEGORY': 'Add new category'

        },

        //HOME
        'HOME': {
            'SEARCH': 'Search',
            'CATEGORY': 'Category'
        },


        'ADMIN': {
            'SELECT_USER': 'Select user',
            'DELETE_USER_WANING_MESSAGE': 'IMPORTANT: All the trainings created by this user will be deleted. You can assig them to an existing user if you want to.',
            'USER_DELETED_SUCCESS': 'User deleted'
        },

        'ciao sono lorenzo': 'hello i\'m lorenzo',
        'my tax': 'my tax eng',
        'custom tax 1': 'custo tax 1 eng'
    }
};
