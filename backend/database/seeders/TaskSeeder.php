<?php

namespace Database\Seeders;

use App\Models\Task;
use Illuminate\Database\Seeder;

/**
 * Ports the hardcoded mockTasks from src/components/TasksList.tsx and the
 * category list from src/components/TaskExamples.tsx into real rows.
 */
class TaskSeeder extends Seeder
{
    public function run(): void
    {
        $tasks = [
            [
                'title' => 'Image Annotation for Autonomous Vehicles',
                'description' => 'Label objects in street scene images to train AI for self-driving cars.',
                'category' => 'Computer Vision',
                'difficulty' => 'Beginner',
                'pay_rate_min' => 15, 'pay_rate_max' => 25,
                'estimated_hours_min' => 2, 'estimated_hours_max' => 4,
                'available_slots' => 150,
                'requirements' => ['Basic computer skills', 'Attention to detail'],
            ],
            [
                'title' => 'Medical Text Classification',
                'description' => 'Categorize medical documents and research papers.',
                'category' => 'Natural Language Processing',
                'difficulty' => 'Intermediate',
                'pay_rate_min' => 20, 'pay_rate_max' => 35,
                'estimated_hours_min' => 3, 'estimated_hours_max' => 6,
                'available_slots' => 75,
                'requirements' => ['Medical background preferred', 'English proficiency'],
            ],
            [
                'title' => 'Speech Transcription & Speaker Labelling',
                'description' => 'Transcribe audio clips and mark speaker turns across multiple languages.',
                'category' => 'Speech & Audio',
                'difficulty' => 'Intermediate',
                'pay_rate_min' => 10, 'pay_rate_max' => 20,
                'estimated_hours_min' => 2, 'estimated_hours_max' => 5,
                'available_slots' => 120,
                'requirements' => ['Good headphones', 'Fluent in at least one supported language'],
            ],
            [
                'title' => 'Video Action Recognition Tagging',
                'description' => 'Annotate actions and scene transitions in short video clips for video AI models.',
                'category' => 'Video Intelligence',
                'difficulty' => 'Advanced',
                'pay_rate_min' => 15, 'pay_rate_max' => 30,
                'estimated_hours_min' => 3, 'estimated_hours_max' => 6,
                'available_slots' => 40,
                'requirements' => ['Stable internet connection', 'Prior annotation experience'],
            ],
            [
                'title' => 'Localization QA for E-commerce',
                'description' => 'Review translated product listings for accuracy and cultural fit.',
                'category' => 'Localization & Testing',
                'difficulty' => 'Beginner',
                'pay_rate_min' => 6, 'pay_rate_max' => 15,
                'estimated_hours_min' => 1, 'estimated_hours_max' => 3,
                'available_slots' => 200,
                'requirements' => ['Native speaker of target language'],
                // Entry-level work, open before approval clears.
                'requires_approval' => false,
            ],
            [
                'title' => 'Search Relevance Rating',
                'description' => 'Rate how well search results match user intent to improve ranking models.',
                'category' => 'Natural Language Processing',
                'difficulty' => 'Beginner',
                'pay_rate_min' => 8, 'pay_rate_max' => 18,
                'estimated_hours_min' => 1, 'estimated_hours_max' => 3,
                'available_slots' => 180,
                'requirements' => ['Strong reading comprehension'],
                'requires_approval' => false,
            ],
        ];

        foreach ($tasks as $task) {
            Task::updateOrCreate(
                ['title' => $task['title']],
                $task + ['requires_approval' => true, 'is_active' => true],
            );
        }
    }
}
