# :hamster: stool :hamster:
p2p chat app built on scuttlebutt

more on scuttlebutt: https://www.scuttlebutt.nz/

potentially chat with friends on the same network without even being connected to the internet :raised_hands:

this is just a more user friendly ui for [scat :mouse:](https://github.com/stripedpajamas/scat)


### install / run from source
```bash
$ git clone https://github.com/stripedpajamas/stool.git
$ cd stool
$ npm install
$ npm run package

# app is now in ./out/your-arch/Stool.app
# e.g. cd out/Stool-darwin-x64 && open Stool.app
```

### commands
stool has support for a couple of scuttlebutt related commands:
#### to join a pub server:
`/pub invite-code`

#### to self-identify:
`/name name` or `/nick name`

#### to identify someone else:
`/identify @id name`

#### to follow someone
`/follow @id`

#### to unfollow someone
`/unfollow @id`

#### to look up someone's id
`/whois @name`

#### to look up your own id
`/whoami`

#### to enter private mode
`/private @recipient1, @recipient2, @...`

#### to quit private mode
`/quit`

### private messaging
stool supports sending private messages. so as not to muddy up the view with public and private messages, stool has you switch contexts by typing `/private @recipient` and then continue messaging. you can type `/quit` to return to the public context.


### what's happening
stool/scat uses a special message type `scat_message`. this means that if you're using something like [Patchwork](https://github.com/ssbc/patchwork), your feed won't be all gobbled up by chat messages. And scat won't be all gobbled up by your posts. 

but since it's all the same protocol and all the same feeds, all the same people are there. stool/scat looks for `about` messages to show a user's name instead of their id, but falls back to the id if necessary.

stool/scat will honor self-identification above a 3rd party's identification of another user, and will honor your identification of another user above their own self-identification. a 3rd party's identification of another user is not honored at all.

### license
MIT
