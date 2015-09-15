

## Color picker doesn't trigger database save.


Naturally, just changing a property isn't going to do it. But I don't want to $watch the selectedOrg, because there's not a good way to un-watch. And I don't want to $watch all orgs, because... sloppy.

It appears that spectrum offers an events api/callback setup, but I couldn't get it to fire. Moving on to actual stuff now...

https://github.com/Jimdo/angular-spectrum-colorpicker
https://bgrins.github.io/spectrum/#events

In theory I could do some extra event listeners or whatever, but for now I'm not going to mess with it.



### Need better breakpoints/scaling for columns


iPad horizontal should show it horizontal, even phone probably should. Scaling.



### Login/welcome/learning process is less than smooth


Confusion on login. Things seemed a bit broken.

Also, it took her to the account info page; it should take her to a "Get Started" page.

Also... it seemed that she couldn't make orgs at first...

Need some intro guidance for first usage. Esp. for mobile, where you can't see all the controls all at once.



### make givingbudget an optional feature

when it's not in place, just get messages to enter a budget, but not errors!

### account creation process bug
if you hit enter, it uses the login form, rather than the creation form. 
then the JS is broken/exited/aborted, so you can't click Create Account


### thorough null-budget checking, etc. 

so... it looks like if people enter a percentage