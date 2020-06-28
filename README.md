# TembuFriends

A social app for Tembusians (An Apollo-11 Project)

![App Poster](https://i.imgur.com/S7d1Enz.png)

## Implemented features

-   Authentication Flow
-   All navigation features
-   Menu bars, Pop-up UI
-   Home page - linked to Tembu Page
-   Profile page
-   Profile editing
-   Posting capabilities
-   Search feature
-   Adding friends

## Upcoming features

-   Notifications
-   QR generator and QR scanner
-   Settings
    -   Notification settings
    -   Help/Contact
    -   About Us
-   Admin features

## Existing bugs

1.  Textstyle of picker is different from Text inputs (profile-edit)
2.  View for iOS differs from Android
    - Popup not showing
    - Some buttons not responsive
    - Header back title covers text

## Navigation flow

    Root Nav                                    # Check for user and route repectively
    ├── Auth Nav                                # Navigation consisting of authentication screens
    │   ├── Sign In
    │   ├── Sign Up
    │   └── Forget Password
    │
    └── Home Tab Nav                            # Bottom Tab navigator (Viewable from any child screens)
        ├── Home Screen                         # Tembusu-related information display (Direct link to Tembu)
        │
        ├── Explore Nav                         # Navigable content from explore feature
        │   ├── Search Profile                  # Initial route of explore tab
        │   │
        │   └── Profile (My/Other Profiles)     # Provide navigation to profile-related screen
        │       ├── Visit Other Profiles        # Initial route
        │       │   └── Write Posts             # Only available when visiting other profile
        │       └── My Profile
        │           └── Edit Profile            # Only available from My Profile
        │               └── Edit Modules        # Only available from Edit Profile
        │
        ├── Notification Nav                    # Navigation for notification
        │   ├── Notification screen             # List of past & current notification
        |   |
        │   └── Profile Nav (My Profile)        # Provide navigation to profile-related screen
        │       ├── My Profile                  # Initial route
        │       │   └── Edit Profile
        │       │       └── Edit Modules
        │       └── Visit Other Profiles
        │           └── Write Posts
        │
        └── Menu Nav                            # Navigable content from explore feature
            ├── Menu Screen                     # Initial route
            │
            ├── Profile (My Profile)        # Called from My Profile button
            |   |
            │   ├── My Profile
            │   │   └── Edit Profile
            │   │       └── Edit Modules
            │   │
            │   ├── Visit Other Profiles
            │   │   └── Write Posts
            │   │
            │   ├── Friends
            |   |
            ├── Profile (Friends)           # Called from Friends button
            │
            ├── QR code
            │   ├── My QR                       # Not implemented yet
            │   └── QR Scanner                  # Not implemented yet
            │
            ├── Settings Nav
            │   ├── Notifications settings      # Not implemented yet
            │   ├── Help                        # Not implemented yet
            │   └── About Us                    # Not implemented yet
            │
            ├── Admin Nav
            │   ├── Reports                     # Not implemented yet
            │   └── User list                   # Not implemented yet
            │
            ├── Delete Screen                   # Testing feature
            │
            └── Logout                          # Home tab is no longer defined and Auth nav is defined instead

See [navigation](https://github.com/JinHao-L/tembu-friends/tree/master/App/navigation) and [screens](https://github.com/JinHao-L/tembu-friends/tree/master/App/screens)

## Backend

-   Serverless backend logic that runs on triggers & callables
-   Built using Firebase Functions

View it here: [link](https://github.com/JinHao-L/tembufriends-functions)

## Tech Stack

-   Language: JavaScript
-   Environment: Node.js
-   Framework: React Native
-   Technologies:
    -   Expo
    -   Firebase
    -   Redux

## License

NIL
