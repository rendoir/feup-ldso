# Changelog

The following list representes the group of changes throughout the development of the project.

## [Sprint 4](https://gitlab.com/feup-tbs/ldso18-19/t3g2/tree/5ff827ce9345cc1712b082a29fb3cf9e182726b11) - 2018-11-29

In the fourth sprint, we fixed some bugs regarding screen refreshing when a screen was switched to another(_US#50_).

We implemented the favorite listing in the app(_US#11_), so the users can now save their favorite events and access them easily.
We also developed integration with google maps, which means any event with a valid location can now be seen on the Google Map app(_US#14_).

In order to present the documented API, we developed a UI for it(_US#52_).

We developed an English Language Support(_US#49_), so the users can switch between portuguese or english on the app and on the web.

Finally, we setup the Staging and Production Servers(_US#51_).

With the previous implemented features from Sprint 3, we were able to list favorite evemts on the app, as well as being able to search by them with any kind of search;
with the previously added _yaml_ file for the openAPI, we were able to create a UI for the API.
By adding the Staging and Production Servers, the API and the web can now be accessed remotely.

### Closed issues
* US[#11](https://gitlab.com/ldso18-19/t3g2/issues/11) 
* US[#14](https://gitlab.com/ldso18-19/t3g2/issues/14)
* US[#46](https://gitlab.com/ldso18-19/t3g2/issues/46)
* US[#49](https://gitlab.com/ldso18-19/t3g2/issues/49)
* US[#50](https://gitlab.com/ldso18-19/t3g2/issues/50)
* US[#51](https://gitlab.com/ldso18-19/t3g2/issues/51)
* US[#52](https://gitlab.com/ldso18-19/t3g2/issues/52)

## [Sprint 3](https://gitlab.com/ldso18-19/t3g2/tree/4f84c5aaf1fde2ff1c91d0f846a53f3374effa0b) - 2018-11-14

In the third sprint, we mostly developed on the app, with only two features on the web:

We finished the authentication on the application, via Google, and also on the web(_US#39_).

On the web, an event now shows all information of it(_US#21_ and _US#32_).

On the mobile application, we implemented the search filter(_US#44_), the search by entity(_US#6_), seeing information about an event(_US#39_) 
and favorite and unfavorite an event(_US#12_ and _US#13_ on the app and _US#37_ and _US#38_ on the api).

In order to maintain a clean code, by analysing programming errors and warnings, such as unused variables, we implemented Linter(_US#45_).
In order to keep track of the API and document it, we used openAPI(_US#47_).

With the previous implemented features from Sprint 1, we were able to list events on the web for entities, as well as being able to search by them with any kind of search.

### Closed issues
* US[#6](https://gitlab.com/ldso18-19/t3g2/issues/6)
* US[#12](https://gitlab.com/ldso18-19/t3g2/issues/12)
* US[#13](https://gitlab.com/ldso18-19/t3g2/issues/13)
* US[#19](https://gitlab.com/ldso18-19/t3g2/issues/19)
* US[#21](https://gitlab.com/ldso18-19/t3g2/issues/21)
* US[#35](https://gitlab.com/ldso18-19/t3g2/issues/35)
* US[#37](https://gitlab.com/ldso18-19/t3g2/issues/37)
* US[#38](https://gitlab.com/ldso18-19/t3g2/issues/38)
* US[#39](https://gitlab.com/ldso18-19/t3g2/issues/39)
* US[#44](https://gitlab.com/ldso18-19/t3g2/issues/44)
* US[#45](https://gitlab.com/ldso18-19/t3g2/issues/45)
* US[#47](https://gitlab.com/ldso18-19/t3g2/issues/47)


## [Sprint 2](https://gitlab.com/feup-tbs/ldso18-19/t3g2/tree/9c2d55e624ae9ef5e13c6fe54117801b6ab8ca3d) - 2018-10-31

In the second sprint, we implemented continuous integration on the project as well a bug fix(_US#43_) and mostly search related features.
We sucessfully implemented the deletion of an event(_US#7_ and _US#33_) and the listing of events(_US#7_) for the web. We also developed searches by category(_US#5_ and _US#31_), searches by text(_US#4_ and _US#30_) and searches by entity(_US#32_) for the mobile application.

With the previous implemented features from Sprint 1, we were able to list events on the web for entities, as well as being able to search by them with any kind of search.

### Closed issues
* US[#4](https://gitlab.com/ldso18-19/t3g2/issues/4)
* US[#5](https://gitlab.com/ldso18-19/t3g2/issues/5)
* US[#7](https://gitlab.com/ldso18-19/t3g2/issues/7)
* US[#24](https://gitlab.com/ldso18-19/t3g2/issues/24)
* US[#30](https://gitlab.com/ldso18-19/t3g2/issues/30)
* US[#31](https://gitlab.com/ldso18-19/t3g2/issues/31)
* US[#32](https://gitlab.com/ldso18-19/t3g2/issues/32)
* US[#33](https://gitlab.com/ldso18-19/t3g2/issues/33)
* US[#43](https://gitlab.com/ldso18-19/t3g2/issues/43)


## [Sprint 1](https://gitlab.com/feup-tbs/ldso18-19/t3g2/tree/f0d2fa6d006ac1f4e2c596a55e981058a3d29ed4) - 2018-10-17

The first sprint consisted on the setup of the database and the development of most of the event related endpoints, such as the endpoint to return all events (_US#28_) and the endpoint to add an event(_US#2_). We also began work on the mobile application by listing events(_US#3_) and on the website by adding an event(_US#29_). Our cooperation with the designers also allowed the creation of the first mockups for the application and the website, available in the [README.md](https://gitlab.com/ldso18-19/t3g2/blob/dev/README.md) file.

### Closed issues
* US[#2](https://gitlab.com/ldso18-19/t3g2/issues/2)
* US[#3](https://gitlab.com/ldso18-19/t3g2/issues/3)
* US[#27](https://gitlab.com/ldso18-19/t3g2/issues/27)
* US[#28](https://gitlab.com/ldso18-19/t3g2/issues/28)
* US[#29](https://gitlab.com/ldso18-19/t3g2/issues/29)
