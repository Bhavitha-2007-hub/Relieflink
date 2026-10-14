import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';
import dotenv from 'dotenv';

dotenv.config();

function geminiApiPlugin(): Plugin {
  return {
    name: 'gemini-api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/explain-match', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const data = JSON.parse(body || '{}');
            const { task, volunteerProfile, distanceKm } = data;

            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
              const skillsList = task.requiredSkills.join(', ').replace(/_/g, ' ');
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  source: 'deterministic',
                  explanation: `Good match: your ${skillsList} skill fits the relief requirements, the shift takes ${task.estimatedHours}h (within your ${volunteerProfile.availableHours}h limit), and it is ${distanceKm} km away in ${task.neighborhoodName.split('&')[0]}.`,
                })
              );
              return;
            }

            const { GoogleGenAI } = await import('@google/genai');
            const ai = new GoogleGenAI({
              apiKey: apiKey,
              httpOptions: {
                headers: {
                  'User-Agent': 'aistudio-build',
                },
              },
            });

            const prompt = `You are ReliefLink's disaster coordination assistant for the simulated Vijayawada flood response (referencing the Budameru rivulet flood situation).
Explain to a volunteer in 1-2 concise, clear, and reassuring sentences why this relief task is a strong match for them.
Volunteer Profile:
- Available time: ${volunteerProfile.availableHours} hours
- Skills: ${volunteerProfile.skills.join(', ')}
- Maximum travel radius: ${volunteerProfile.travelRadiusKm} km
- Starting sector: ${volunteerProfile.startingNeighborhood}

Matched Task:
- Title: "${task.title}"
- Location: ${task.neighborhoodName} (${distanceKm} km away)
- Duration: ${task.estimatedHours} hours
- Skills required: ${task.requiredSkills.join(', ')}
- Open spots: ${task.totalCapacity - task.spotsFilled} of ${task.totalCapacity}
- Safety note: ${task.safetyNote}

CRITICAL RULES:
- Highlight the exact skill match, the convenient distance, and that time required fits their availability.
- Plain language only. Keep it under 35 words.
- Do NOT make up new facts or promise medical dispatch.
- Keep the tone calm, practical, and supportive.`;

            const response = await ai.models.generateContent({
              model: 'gemini-3.8-flash',
              contents: prompt,
            });

            const text = response.text?.trim() || '';
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                source: 'gemini',
                explanation: text || `Good match: your skills fit, the task requires ${task.estimatedHours}h, and it is located ${distanceKm} km away in ${task.neighborhoodName.split('&')[0]}.`,
              })
            );
          } catch (err: any) {
            console.error('Error generating AI explanation:', err);
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                source: 'deterministic-fallback',
                explanation: 'Good match: fits your available time, required skills, and travel radius.',
              })
            );
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), geminiApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve('.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
