export enum BackendRoutes {
  /*AUTH*/
  LOGIN = '/login',
  LOGOUT = '/logout',
  SIGNUP = '/signup',
  GET_USER = '/user',
  LOST_PASSWORD = '/lost-password',
  RESET_PASSWORD = '/lost-password/reset-password',
  CHECK_USERNAME = '/signup/checkUsername',
  CHECK_EMAIL = '/signup/checkEmail',
  CONFIRM = '/confirm-email',
  SEND_CONFIRM = '/confirm-email/send-confirm',

  /*PROFILE*/
  PROFILE_PIC = '/profile/picture',
  PROFILE = '/profile',
  UPDATE_PROFILE = '/profile/update',
  UPDATE_PASSWORD = '/profile/update-password',
  PROFILE_FULLNAME = '/profile/full-name',
  PROFILE_FROM_USERNAME = '/profile/from-username',
  PUBLIC_PROFILE_FROM_USERNAME = '/profile/public/from-username',
  USERID_FROM_USERNAME = '/profile/id-from-username',
  CAN_PUBLISH ="/profile/can-publish",
  PROFILE_PIC_FROM_ID ='/profile/picture/from-id',
  GET_PROFILE_USERNAME = '/profile/username/from-id',
  PROFILE_SET_LANG = '/profile/lang',

  /*BILLING*/
  BILLING_UPDATE = '/profile/billing/update',

  /*SUBCRIPTION*/
  MANAGE_SUBCRIPTION = '/profile/manage-subscription',
  SUBSCRIPTION_STATUS = '/subscription/status',

  /* STRIPE */
  STRIPE_CREATE_PORTAL = '/stripe/create-customer-portal-session',
  STRIPE_PAYMENT_METHOD_HANDLER = '/stripe/handlePayment',
  STRIPE_GET_PRORATION = '/stripe/get-proration',
  STRIPE_UPDATE_PLAN = '/stripe/update-plan',

  /*PAYPAL*/
  PAYPAL_SUBSCRIPTION = '/paypal/save-subscription',
  PAYPAL_UPGRADE_PLAN = '/paypal/upgrade-plan',
  PAYPAL_CANCEL_SUBSCRIPTION = '/paypal/cancel-subscription',
    

  /*TRAINING*/
  TRAINING_CUSTOMIZE_SYNC_CATEGORIES = '/training/customize/sync-categories',
  TRAINING_CUSTOMIZE_GET_CATEGORIES = '/training/customize/categories',
  TRAINING_CUSTOMIZE_SYNC_TAXONOMIES = '/training/customize/sync-taxonomies',
  TRAINING_CUSTOMIZE_GET_TAXONOMIES = '/training/customize/taxonomies',
  TRAINING_CUSTOMIZE_GET_SELECT_TAXONOMIES = '/training/customize/select-taxonomies',
  TRAINING_CUSTOMIZE_SYNC_SELECT_TAXONOMIES = '/training/customize/sync-select-taxonomies',
  TRAINING_INSERT = '/training/insert',
  TRAINING_ADD_IMAGE = '/training/add-image',
  TRAININGS = '/training/trainings',
  TRAINING_IMG = '/training/img',
  TRAINING_FILE = '/training/file',
  TRAINING_COVER = '/training/cover-img',
  TRAINING_VIDEO_THUMB = '/training/cover-video-thumb',
  TRAINING_FROM_ID = '/training/from-id',
  TRAINING_DRAFT_INSERT = '/training/insert-draft',
  TRAINING_DRAFTS = '/training/drafts',
  TRAINING_EDIT = '/training/edit',
  TRAINING_DELETE = '/training/delete',
  TRAININGS_PUBLIC = '/training/public-trainings',
  TRAININGS_PUBLIC_LAZY = '/training/public-trainings/lazy/',
  TRAINING_ADD_IMAGES = '/training/add-images',
  TRAINING_ADD_FILES = '/training/add-files',
  USER_PUBLIC_TRAININGS = '/training/user-public-trainings',
  TRAINING_PDF = '/training/create-pdf',
  TRAINING_DELETE_IMG = '/training/delete-imgs',
  TRAINING_DELETE_FILES = '/training/delete-files',
  TRAINING_TACTICALPAD_IMG_PATHS = '/training/tacticalpad-img-paths',
  TRAINING_TACTICALPAD_FILE_PATHS = '/training/tacticalpad-file-paths',


  /* ADMIN */
  ADMIN_GET_USERS = '/admin/users',
  ADMIN_GET_USER = '/admin/user/',
  ADMIN_GET_PROFILE_PIC = '/admin/user/:id/get-profile-pic',
  ADMIN_UPDATE_USER = '/admin/update-user',
  ADMIN_CUSTOMIZE_SYNC_CATEGORIES = '/admin/customize/sync-categories',
  ADMIN_CUSTOMIZE_GET_CATEGORIES = '/admin/customize/categories',
  ADMIN_CUSTOMIZE_SYNC_TAXONOMIES = '/admin/customize/sync-taxonomies',
  ADMIN_CUSTOMIZE_GET_TAXONOMIES = '/admin/customize/taxonomies',
  ADMIN_CUSTOMIZE_GET_SELECT_TAXONOMIES = '/admin/customize/select-taxonomies',
  ADMIN_CUSTOMIZE_SYNC_SELECT_TAXONOMIES = '/admin/customize/sync-select-taxonomies',
  ADMIN_DELETE_USER = '/admin/user/delete',

  /* GROUP  */
  GROUP_SEARCH_ATHOR_BY_EMAIL = '/group/search-author/',
  GROUP_CREATE = '/group/insert',
  GROUP_UPDATE = '/group/edit',
  GROUP_DELETE = '/group/delete',
  GROUP_ADD_IMAGES = '/group/add-images',
  GROUP_DEL_IMAGES = '/group/delete-imgs',
  GROUPS = '/group/list',
  GROUP_ADD_AUTHOR = '/group/add-author',
  GROUP_ADD_TRAINING = '/group/add-training',
  GROUP_ADD_SUBSCRIPTION = '/group/add-subs',
  GROUP_GET_IMAGE = '/group/img'
}