"use client";

import React, { useState } from 'react';
import { Container, AppBar, Typography, Box, Button, Toolbar, Grid, Card, CardContent } from "@mui/material";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Head from "next/head";
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';

export default function Home() {
  const [loading, setLoading] = useState(false); 
  const router = useRouter();

  const handleCheckout = async () => {
  setLoading(true); 
  try {
    const response = await fetch('/api/checkout_sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plan: 'pro', 
        quantity: 1, 
      }),
    });

    const rawResponse = await response.text(); 
    console.log('Raw response:', rawResponse); 

    try {
      const data = JSON.parse(rawResponse); 
      if (data.id) {
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
        await stripe.redirectToCheckout({ sessionId: data.id });
      } else {
        console.error('Error:', data.error.message);
      }
    } catch (jsonError) {
      console.error('Failed to parse JSON:', jsonError);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setLoading(false); 
  }
};

  return (
    <Container maxWidth="lg">
      <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content="Create flashcards from your text" />
      </Head>

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" style={{ flexGrow: 1 }}>Flashcard SaaS</Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">Login</Button>
            <Button color="inherit" href="/sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          textAlign: 'center',
          my: 4,
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Flashcard SaaS
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          The easiest way to create flashcards from your text.
        </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2, mr: 2 }} href="/generate">
          Get Started
        </Button>
        <Button variant="outlined" color="primary" sx={{ mt: 2 }}>
          Learn More
        </Button>
      </Box>

      <Box sx={{ my: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom>Features</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Easy Text Input</Typography>
                <Typography>Simply input your text and let our software do the rest. Creating flashcards has never been easier.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Smart Flashcards</Typography>
                <Typography>Our AI intelligently breaks down your text into concise flashcards, perfect for studying.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Accessible Anywhere</Typography>
                <Typography>Access your flashcards from any device, at any time, with ease.</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ my: 6, textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom>Pricing</Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Pro Plan</Typography>
                <Typography variant="h4" color="primary" gutterBottom>$10 / month</Typography>
                <Typography>Unlimited flashcards and storage.</Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  sx={{ mt: 2 }} 
                  onClick={handleCheckout}
                  disabled={loading} // Disable button while loading
                >
                  {loading ? 'Processing...' : 'Subscribe to Pro Plan'} {}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
