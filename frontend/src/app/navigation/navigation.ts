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
        id       : 'groups',
        title    : 'groups',
        translate: 'NAV.GROUPS',
        type     : 'group',
        children : [
            {
                id       : 'groups-library',
                title    : 'Groups Library',
                translate: 'NAV.GROUPS',
                type     : 'item',
                icon     : 'library_books',
                url      : 'groups/groups-library'
            },
            {
                id       : 'groups-insert',
                title    : 'Insert Group',
                translate: 'Insert Group',
                type     : 'item',
                icon     : 'add',
                url      : 'group/insert'
            },
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