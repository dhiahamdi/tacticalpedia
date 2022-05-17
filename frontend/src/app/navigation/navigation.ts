import { FuseNavigation } from '@fuse/types';

const navigation: FuseNavigation[] = [
    {
        id       : 'home',
        title    : '',
        translate: '',
        type     : 'group',
        children : [
            {
                id       : 'home',
                title    : 'Home',
                translate: 'NAV.HOME',
                type     : 'item',
                icon     : 'home',
                url      : '/',
                exactMatch: true
            }
        ]

    },

    {   
        id       : 'training',
        title    : 'Training',
        translate: 'NAV.TRAINING',
        type     : 'group',
        children : [
            {
                id       : 'insert-training',
                title    : 'Insert training',
                translate: 'NAV.INSERT_TRAINING',
                type     : 'item',
                icon     : 'add',
                url      : '/training/manage-insert'
            },
            {
                id       : 'insert-draft',
                title    : 'Insert draft',
                translate: 'NAV.INSERT_DRAFT',
                type     : 'item',
                icon     : 'flash_on',
                url      : '/training/insert-draft'
            },
            {
                id       : 'training-library',
                title    : 'Training library',
                translate: 'NAV.TRAINING_LIBRARY',
                type     : 'item',
                icon     : 'book',
                url      : '/training/library'
            },
            {
                id       : 'customize-training',
                title    : 'Customize training',
                translate: 'NAV.CUSTOMIZE_TRAINING',
                type     : 'item',
                icon     : 'dashboard_customize',
                url      : '/training/customize'
            }
        ]
    },
    {   
        id       : 'group',
        title    : 'Group',
        type     : 'group',
        children : [
            {
                id       : 'group-explore',
                title    : 'Explore Groups',
                translate: 'NAV.Group_EXPLORE',
                type     : 'item',
                icon     : 'book',
                url      : '/group/library'
            },
            {
                id       : 'insert-group',
                title    : 'Insert group',
                translate: 'NAV.INSERT_GROUP',
                type     : 'item',
                icon     : 'add',
                url      : '/group/insert'
            },
            {
                id       : 'my-groups',
                title    : 'My groups',
                translate: 'NAV.Group_LIBRARY',
                type     : 'item',
                icon     : 'book',
                url      : '/group/mygroups'
            },
            {
                id       : 'group-subs',
                title    : 'Subscription',
                type     : 'item',
                icon     : 'book',
                url      : '/group/subs'
            },
            
            
        ]
    }

];



const adminNavigation = [...navigation,
    {   
        id       : 'admin',
        title    : 'Admin',
        type     : 'group',
        children : [
            {
                id       : 'manage-users',
                title    : 'Manage users',
                type     : 'item',
                icon     : 'add_to_photos',
                url      : '/admin/user-list'
            },
            {
                id       : 'admin-customize',
                title    : 'Customize fields',
                type     : 'item',
                icon     : 'file_copy',
                url      : '/admin/customize'
            },
        ]
    }
];

export { navigation, adminNavigation};

