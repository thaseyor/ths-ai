# Ths AI

This AI allows you to train net with your telegram chats and then use it to chat with others

## 1. Create a Telegram app

Login in [here](https://my.telegram.org/) and create a new app.

Then copy your `api_id` and `api_hash` to the `.env.example` file.
Also do not forget to set the `phone number` of your account.

Rename `.env.example` to `.env`

## 2. Export Telegram data

Open telegram desktop and go to:

`Settings -> Advanced -> Export Telegram Data `

Only those options should be enabled:

- Account information
- Personal chats
- Machine-readable JSON

Export the `result.json` file and save it to `/data` folder

## 3. Last few steps

```bash

# Install dependencies
pnpm install

# Convert telegram data to convinient form
pnpm parse

# Train net
pnpm train

# Run!
pnpm start

```
