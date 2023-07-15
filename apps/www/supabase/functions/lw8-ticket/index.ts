// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

import { handler } from './handler.js'

console.log(`Function "lw8-ticket-og" up and running!`)

serve(handler)
