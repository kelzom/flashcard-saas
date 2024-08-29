'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container, Grid, Typography, Card, CardActionArea, CardContent, Box } from '@mui/material';
import { useUser } from '@clerk/nextjs';
import { collection, doc, getDocs } from 'firebase/firestore';
import db from '@/firebase';

export default function FlashcardSet() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const searchParams = useSearchParams();
  const setId = searchParams.get('id');
  const router = useRouter();

  useEffect(() => {
    const fetchFlashcards = async () => {
      if (!setId || !user) return;

      const colRef = collection(doc(collection(db, 'users'), user.id), 'flashcardSets', setId, 'flashcards');
      const querySnapshot = await getDocs(colRef);

      const cards = [];
      querySnapshot.forEach((doc) => {
        cards.push({ id: doc.id, ...doc.data() });
      });

      setFlashcards(cards);
    };

    fetchFlashcards();
  }, [setId, user]);

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Flashcard Set: {setId}
      </Typography>

      <Grid container spacing={3} sx={{ mt: 4 }}>
        {flashcards.map((flashcard) => (
          <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
            <Card>
              <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
                <CardContent>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    {!flipped[flashcard.id] ? (
                      <Typography variant="h6">{flashcard.front}</Typography>
                    ) : (
                      <Typography variant="h6">{flashcard.back}</Typography>
                    )}
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {flashcards.length === 0 && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            No flashcards found in this set.
          </Typography>
        </Box>
      )}
    </Container>
  );
}
