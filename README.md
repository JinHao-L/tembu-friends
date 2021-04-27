# TembuFriends

A social app for Tembusians (An Apollo-11 Project)

![App Poster](https://i.imgur.com/e6QMP4f.png)

For **detailed write-up**, see [Google Doc](https://docs.google.com/document/d/1QqdZvL2rQxd9YPI_1KxZBTe_RL20MkOKKq330yiCV4c/edit?usp=sharing)

## Demo

[![Watch the demo on Youtube](https://i.ibb.co/yPKNb1L/image.png)](https://www.youtube.com/watch?v=vYg_Eed1BIs)

Hosted on Expo server: [(here)](https://expo.io/@tembufriends/TembuFriends)

(*NUS email is required to use the app)

(*Due to Apple limitation, expo-hosted apps are not accessible by iOS system.)

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
-   Notifications
-   Custom QR generator and QR scanner
-   Settings
    -   Notification settings
    -   FAQ
    -   Contact Us
-   Admin features
    -   User list (Verify, ban or make users admin)
    -   Posts' report handling

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
            ├── Profile (My Profile)            # Called from My Profile button
            |   |
            │   ├── My Profile
            │   │   └── Edit Profile            # Edit profile info
            │   │       └── Edit Modules
            │   │
            │   └── Visit Other Profiles        # Visit other user through their posts
            │       └── Write Posts
            |   
            ├── Friend List                     # Called from Friends button
            │
            ├── QR code
            │   ├── My QR                       # To view QR code/ save it in gallery
            │   └── QR Scanner                  # Use camera to scan QR image
            │
            ├── Settings Nav
            │   ├── Notifications settings      # To disable/enable notifications
            │   ├── Help                        # Common FAQs about the app usage
            │   └── About Us                    # Short description about the creator
            │
            ├── Admin Nav
            │   ├── Reports                     # To verify and review reported posts
            │   └── User list                   # To view, ban users or make users admin
            │
            ├── Delete Screen                   # For account creation testing
            │
            └── Logout                          # Return to Auth Nav

For source code, see [navigations](https://github.com/JinHao-L/tembu-friends/tree/master/App/navigation) and [screens](https://github.com/JinHao-L/tembu-friends/tree/master/App/screens)

## Backend

-   Serverless backend logic that runs on triggers & callables
-   Built using Firebase Functions

View it here: [link](https://github.com/JinHao-L/tembufriends-functions)

## Tech Stack

-   Language: JavaScript (Node.js)
-   Framework: React Native
-   Technologies:
    -   Expo
    -   Firebase
    -   Redux

## License

Copyright 2020 Jin Hao and Sebastian Png.

Licensed under the MIT License
