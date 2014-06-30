FORMAT: 1A
HOST: https://vchat.labsperson.com

# LivePerson-UoP Video Chat - a.k.a Azara
This API allows creating and managing Video Chat Rooms that are similar to conventional chat rooms only that the data passed is a video stream,
directly between peers (using WebRTC) rather than through the server.

* All requests receive the v1 version of the API by default.
Explicitly changing this is done through the Accept header.
* All timestamps are returned in ISO 8601 format: "YYYY-MM-DDTHH:MM:SSZ".
* IDs are type 4 random generated UUIDs.

## Authentication
*Azara* uses OAuth Authorization. First you create a new (or acquire existing) OAuth token using Basic Authentication. After you have acquired your token you can use it to access other resources within token's scope.

## Media Types
Where applicable this API uses the [HAL+JSON](https://github.com/mikekelly/hal_specification/blob/master/hal_specification.md) media-type to represent resources states and affordances.

Requests with a message-body are using plain JSON to set or update resource states.

## Error States
The common [HTTP Response Status Codes](https://github.com/for-GET/know-your-http-well/blob/master/status-codes.md) are used.

# Azara API Root [/]
Azara API entry point.

This resource does not have any attributes. Instead it offers the initial API affordances in the form of the HTTP Link header and
HAL links.

## Retrieve the Entry Point [GET]

+ Response 200 (application//vnd.lpvchat.v1+json)
    + Headers

            Link: </>;rel="self",</rooms>;rel="rooms",</authorization>;rel="authorization"

    + Body

            {
                "_links": {
                    "self": { "href": "/" },
                    "rooms": { "href": "/rooms" }
                    "authorization": { "href": "/authorization"}
                }
            }

# Group Access Authorization and Control
Access and Control of *Azara* OAuth token.

## Authorization [/authorization]
Authorization Resource represents an authorization granted to the user. You can **only** access your own authorization, and only through **Basic Authentication**.

The Authorization Resource has the following attribute:

- token
- scopes

Where *token* represents an OAuth token and *scopes* is an array of scopes granted for the given authorization. At this moment the only available scope is `room_create`.

+ Model (application/vnd.lpvchat.v1+json)

    + Headers

            Link: </authorizations/1>;rel="self"

    + Body

            {
                "_links": {
                    "self": { "href": "/authorizations" },
                },
                "scopes": [
                    "room_create"
                ],
                "token": "abc123"
            }

### Retrieve Authorization [GET]
+ Request (application/vnd.lpvchat.v1+json)
    + Headers

            Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==

+ Response 200

    [Authorization][]

### Create Authorization [POST]
+ Request (application/vnd.lpvchat.v1+json)
    + Headers

            Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==

    + Body

            {
                "scopes": [
                    "room_create"
                ]
            }

+ Response 201

    [Authorization][]

### Remove an Authorization [DELETE]
+ Request (application/vnd.lpvchat.v1+json)
    + Headers

            Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==

+ Response 204


# Group Chat Room
Chat Room related resources of *Azara API*.

## Room [/rooms/{rid}{?access_token}]
A chat room which is the central resource in the Azara API.

The Room resource has the following attributes:

- rid
- created_at
- status

The attributes *id* and *created_at* are assigned by the Azara API at the moment of creation.

+ Parameters
    + rid (string) ... ID of the Room
    + access_token (string, optional) ... Azara API access token.

+ Model (application/vnd.lpvchat.v1+json)

    HAL+JSON representation of Gist Resource. In addition to representing its state in the JSON form it offers affordances in the form of the HTTP Link header and HAL links.

    + Headers

            Link: </rooms/xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx>;rel="self", </rooms/xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx/participants>;rel="participants"

    + Body

            {
                "_links": {
                    "self": { "href": "/rooms/xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx" },
                    "participants": { "href": "/rooms/xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx/participants" },
                },
                "id": "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx",
                "created_at": "2014-04-14T02:15:15Z",
                "status": "open",
                "participants": []
            }

### Retrieve a Room [GET]
+ Request (application/vnd.lpvchat.v1+json)
+ Response 200

    [Room][]

### Create a Room [POST]
This action requries an `access_token` with `room_create` scope.

+ Parameters
    + access_token (string, required) ... Azara API access token.

+ Request (application/vnd.lpvchat.v1+json)

+ Response 201

    [Room][]

## Participant [/rooms/{rid}/participants/{pid}{?access_token}]
A single participant in a room.

+ Parameters
    + rid (string) ... ID of the Room
    + pid (string) ... ID of the participant
    + access_token (string, optional) ... Azara API access token.


+ Model (application/vnd.lpvchat.v1+json)

    HAL+JSON representation of the Participant resource

    + Headers

            Link: </rooms/xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx/participants/5>;rel="self"

    + Body

            {
                "_links": {
                    "self": { "href": "/rooms/xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx/participants/5" }
                },
                "name": "X",
                "streams": {"webcam": "", "screen": ""},
                "joined_at": "2014-04-14T02:15:15Z"
            }

### Leave a Room [DELETE]
+ Request (application/vnd.lpvchat.v1+json)
+ Response 204

## Stream [/rooms/{rid}/participants/{pid}/stream/{stype}{?access_token}]
A stream is a channel that can be connected to from the participant,
 for now the type is either 'screen' or 'webcam'
+ Parameters
    + rid (string) ... ID of the Room
    + pid (string) ... ID of the participant
    + stype (string) ... Type of the stream
    + access_token (string, optional) ... Azara API access token.

### Add a stream [PUT]
+ Request (application/vnd.lpvchat.v1+json)

+ Response 200

    + Body

            {
                "_links": {
                    "self": { "href": "/rooms/xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx/participants/5/streams/webcam" }
                },
                "data": {}
            }

### Remove a stream [DELETE]
+ Request (application/vnd.lpvchat.v1+json)
+ Response 204

## Participants [/rooms/{rid}/participants{?access_token}]
The collection of participants in the Room.

+ Parameters
    + rid (string) ... ID of the room
    + access_token (string, optional) ... Azara API access token.

+ Model (application/vnd.lpvchat.v1+json)

    HAL+JSON representation of the participants collection

    + Headers

            Link: </rooms/xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx/participants>;rel="self"

    + Body

            {
                "_links": {
                    "self": { "href": "/rooms/xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx/participants" }
                },
                "data": [
                    {...}
                ]
            }

### Get Participants [GET]
+ Request (application/vnd.lpvchat.v1+json)
+ Response 200
    [Participants][]

### Join a Room [POST]
+ Request (application/vnd.lpvchat.v1+json)
+ Response 204