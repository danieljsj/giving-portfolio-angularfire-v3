

### Color picker doesn't trigger database save.

Naturally, just changing a property isn't going to do it. But I don't want to $watch the selectedOrg, because there's not a good way to un-watch. And I don't want to $watch all orgs, because... sloppy.

It appears that spectrum offers an events api/callback setup, but I couldn't get it to fire. Moving on to actual stuff now...

https://github.com/Jimdo/angular-spectrum-colorpicker
https://bgrins.github.io/spectrum/#events

In theory I could do some extra event listeners or whatever, but for now I'm not going to mess with it.



### Need better breakpoints/scaling for columns

iPad horizontal should show it horizontal, even phone probably should. Scaling.