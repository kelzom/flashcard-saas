'use client';

import { useState, useEffect } from 'react';
import { Container, Grid, Typography, Card, CardActionArea, CardContent, Box, Button } from '@mui/material';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import db from '@/firebase';

export default function Flashcards() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const getFlashcards = async () => {
      if (!user) return;

      const docRef = doc(collection(db, 'users'), user.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        setFlashcards(userData.flashcardSets || []);
      } else {
        setFlashcards([]);
      }
    };

    getFlashcards();
  }, [user]);

  const handleCardClick = (setName) => {
    router.push(`/flashcard?id=${setName}`);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Your Flashcard Sets
      </Typography>

      <Grid container spacing={3} sx={{ mt: 4 }}>
        {flashcards.map((flashcardSet, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardActionArea onClick={() => handleCardClick(flashcardSet.name)}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {flashcardSet.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {flashcards.length === 0 && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            You have no saved flashcard sets.
          </Typography>
          <Button variant="contained" color="primary" sx={{ mt: 2 }} href="/generate">
            Create Flashcards
          </Button>
        </Box>
      )}
    </Container>
  );
}
