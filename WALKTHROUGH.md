This extension is hosted on GitHub. For further details, please see the README: https://github.com/simkinsw/startgg-twitch-extension For the unminified code, please see the release tag: https://github.com/simkinsw/startgg-twitch-extension/releases/tag/1.0.0

This extension is a TypeScript React app. All data is sourced from the video game tournament organizing site StartGG: https://www.start.gg

The extension consists of two pieces.

1. The streamer's Live Config view. This panel asks the streamer for 2 inputs. First, their personal StartGG api token. This is used to pull data from StartGG. Second, the StartGG url of the particular event they are streaming.

Once those two inputs are provided, the Live Config view will load all the currently available data from StartGG and publish a condensed form to the Config Service. Then it will start a periodic polling loop looking for incremental updates. When it finds any new results, it will update the condensed form of the data in Config Service and publish the incremental results to PubSub.

2. The viewer's component view is simply a UI on top of the data. On startup, it will read the config from the Config Store, and then register with PubSub for incremental updates.

The viewer's component allows them to filter by: phase of the tournament, specific players, upsets, or top seeded players.

[Changelog v 1.0.0]

This is the initial release of the extension. All features described above are new.

[Steps for Testing the Extension]

[Streamer test]
Step 1: Add the extension to your channel

Step 2: Open the offline config panel. There is a link to create a StartGG account and generate an API token. Either go through that process, or use this one that was allocated for review: <!!!UPDATE ME!!!> . Click the "Remember Me" button and then "Validate" to put the token in local storage and verify access to StartGG.

Step 3: Start a stream

Step 4: Open the live config panel. The first box is the same as the offline config. If you clicked "Remember Me" in step 2, it should already be complete. Otherwise repeat step 2 here.

Step 5: "Select Event". This box is for configuring which StartGG event is being streamed. Here are two events that we use for testing.
- https://www.start.gg/tournament/midlane-melee-73-1/event/melee-singles
- https://www.start.gg/tournament/wisdom-melee/event/melee-singles

[Viewer test]
Step 6: Open the stream from the viewer's perspective. The extension should be populated with data from the tournament.

Step 7: Try out the filters on the Results tab. You can pick different phases, search for specific player, or filter by upsets/top seeds

Step 8: On the live config panel, put in a different event. Verify that the viewer's panel changes


Please reach out to me at any time at patrick.dougherty.0208@gmail.com for details or to turn on my channel.