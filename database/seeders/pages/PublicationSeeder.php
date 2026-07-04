<?php

namespace Database\Seeders\pages;

use App\Models\pages\Publication;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PublicationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $publications = [
            [
                'title' => 'Climate Change and Its Impact in Hatiya Island',
                'excerpt' => 'Climate change and its impact on health and livelihood within Hatiya Island of Bangladesh.',
                'date' => '2022-08-16',
                'category' => 'Climate Change',
                'image' => 'https://placehold.co/600x400/009BE2/FFFFFF?text=Climate+Change',
                'pdf_url' => '#',
                'author' => 'Dr. Rahman',
                'tags' => ['Climate Change', 'Hatiya Island', 'Bangladesh', 'Environment'],
                'read_time' => '3 minutes',
                'views' => 245,
                'is_featured' => true,
                'is_active' => true,
                'full_content' => '<h2>Understanding Climate Change in Hatiya Island</h2>
                    <p>Hatiya Island, located in the Meghna River estuary in Bangladesh, is one of the most vulnerable areas to climate change impacts. The island faces numerous challenges including sea-level rise, increased cyclone intensity, and coastal erosion.</p>
                    
                    <h3>Key Findings</h3>
                    <ul>
                        <li>Sea levels have risen by 2.5mm annually over the past decade</li>
                        <li>Cyclone frequency has increased by 40% in the last 20 years</li>
                        <li>Coastal erosion has affected over 60% of the island\'s coastline</li>
                        <li>Agricultural productivity has declined by 25% due to salinity intrusion</li>
                    </ul>
                    
                    <h3>Health Impacts</h3>
                    <p>The changing climate has significantly affected the health of island residents. Increased frequency of waterborne diseases, malnutrition, and mental health issues have been observed. The lack of proper healthcare facilities exacerbates these challenges.</p>
                    
                    <h3>Livelihood Challenges</h3>
                    <p>Traditional livelihoods such as fishing and farming have been severely impacted. Many families have been forced to relocate to the mainland, leading to social disruption and loss of cultural heritage.</p>
                    
                    <h3>Recommended Solutions</h3>
                    <ol>
                        <li>Implement coastal protection measures including mangrove afforestation</li>
                        <li>Develop climate-resilient agricultural practices</li>
                        <li>Establish early warning systems for cyclones and floods</li>
                        <li>Provide alternative livelihood options for affected communities</li>
                        <li>Strengthen healthcare infrastructure and emergency response</li>
                    </ol>'
            ],
            [
                'title' => 'Sustainable Agriculture Practices in Coastal Areas',
                'excerpt' => 'Exploring sustainable farming methods to adapt to rising sea levels and saline intrusion.',
                'date' => '2023-01-10',
                'category' => 'Agriculture',
                'image' => 'https://placehold.co/600x400/28A745/FFFFFF?text=Sustainable+Agriculture',
                'pdf_url' => '#',
                'author' => 'Prof. Ahmed',
                'tags' => ['Agriculture', 'Sustainability', 'Coastal Areas', 'Farming'],
                'read_time' => '4 minutes',
                'views' => 189,
                'is_featured' => false,
                'is_active' => true,
                'full_content' => '<h2>Innovative Agricultural Solutions for Coastal Bangladesh</h2>
                    <p>Coastal areas of Bangladesh face unique challenges in agriculture due to salinity intrusion, waterlogging, and extreme weather events. This research explores sustainable farming methods that can help communities adapt and thrive.</p>
                    
                    <h3>Salinity-Tolerant Crops</h3>
                    <p>Several salt-tolerant varieties of rice, vegetables, and fruits have been developed and tested in coastal areas. These crops show promising results in maintaining yields despite increasing soil salinity.</p>
                    
                    <h3>Integrated Farming Systems</h3>
                    <p>Combining aquaculture with agriculture (rice-fish farming) has proven effective in coastal areas. This integrated approach provides multiple income sources and improves food security.</p>
                    
                    <h3>Water Management Techniques</h3>
                    <ul>
                        <li>Rainwater harvesting systems for irrigation</li>
                        <li>Raised bed farming to avoid waterlogging</li>
                        <li>Drip irrigation to conserve water</li>
                        <li>Construction of small-scale water reservoirs</li>
                    </ul>
                    
                    <h3>Community Success Stories</h3>
                    <p>Several communities in the coastal belt have successfully adopted these practices. Training programs and government support have been crucial in their implementation.</p>'
            ],
            [
                'title' => 'Renewable Energy Solutions for Island Communities',
                'excerpt' => 'Implementing solar and wind energy systems to reduce dependency on fossil fuels.',
                'date' => '2023-03-22',
                'category' => 'Energy',
                'image' => 'https://placehold.co/600x400/FDB813/FFFFFF?text=Renewable+Energy',
                'pdf_url' => '#',
                'author' => 'Dr. Islam',
                'tags' => ['Renewable Energy', 'Solar Power', 'Wind Energy', 'Islands'],
                'read_time' => '5 minutes',
                'views' => 312,
                'is_featured' => true,
                'is_active' => true,
                'full_content' => '<h2>Powering Island Communities Sustainably</h2>
                    <p>Island communities in Bangladesh have long been dependent on expensive and polluting diesel generators. This research explores the potential of renewable energy solutions to provide clean, affordable, and reliable electricity.</p>
                    
                    <h3>Solar Energy Solutions</h3>
                    <p>Solar home systems have been successfully implemented in several islands, providing electricity to thousands of households. Community solar mini-grids are now being explored as a scalable solution.</p>
                    
                    <h3>Wind Energy Potential</h3>
                    <p>Coastal areas and islands offer significant wind energy potential. Studies show that wind speeds are adequate for small to medium-scale wind turbines, particularly during monsoon seasons.</p>
                    
                    <h3>Hybrid Systems</h3>
                    <p>Combining solar and wind energy with battery storage creates reliable power supply systems. These hybrid systems can meet the energy needs of island communities while reducing carbon emissions.</p>
                    
                    <h3>Economic and Social Benefits</h3>
                    <ul>
                        <li>Reduced energy costs for households and businesses</li>
                        <li>Employment opportunities in installation and maintenance</li>
                        <li>Improved education through reliable electricity for schools</li>
                        <li>Enhanced healthcare services with powered medical equipment</li>
                    </ul>'
            ],
            [
                'title' => 'Biodiversity Conservation in the Sundarbans',
                'excerpt' => 'Preserving the unique ecosystem of the world\'s largest mangrove forest.',
                'date' => '2023-05-05',
                'category' => 'Biodiversity',
                'image' => 'https://placehold.co/600x400/2D8659/FFFFFF?text=Sundarbans',
                'pdf_url' => '#',
                'author' => 'Dr. Khan',
                'tags' => ['Biodiversity', 'Sundarbans', 'Mangroves', 'Conservation'],
                'read_time' => '6 minutes',
                'views' => 156,
                'is_featured' => false,
                'is_active' => true,
                'full_content' => '<h2>Protecting the Sundarbans Ecosystem</h2>
                    <p>The Sundarbans, the world\'s largest mangrove forest, is a UNESCO World Heritage site that supports incredible biodiversity. This research highlights conservation efforts and challenges facing this unique ecosystem.</p>
                    
                    <h3>Floral Diversity</h3>
                    <p>The Sundarbans hosts over 70 species of mangroves, including the iconic Sundari tree. The forest provides critical habitat for numerous plant species, many of which have medicinal properties.</p>
                    
                    <h3>Wildlife Conservation</h3>
                    <p>The Sundarbans is home to the endangered Royal Bengal Tiger, as well as numerous species of birds, reptiles, and aquatic life. Conservation efforts focus on protecting these species and their habitats.</p>
                    
                    <h3>Threats to the Ecosystem</h3>
                    <ul>
                        <li>Climate change and sea-level rise</li>
                        <li>Illegal logging and poaching</li>
                        <li>Pollution from upstream industries</li>
                        <li>Declining freshwater flow due to upstream dams</li>
                    </ul>
                    
                    <h3>Conservation Initiatives</h3>
                    <p>Several organizations are working on conservation projects including community-based forest management, tiger monitoring programs, and mangrove restoration efforts.</p>'
            ],
            [
                'title' => 'Community-Based Disaster Preparedness',
                'excerpt' => 'Strengthening local communities to respond effectively to natural disasters.',
                'date' => '2023-07-14',
                'category' => 'Disaster Management',
                'image' => 'https://placehold.co/600x400/E74C3C/FFFFFF?text=Disaster+Preparedness',
                'pdf_url' => '#',
                'author' => 'Prof. Hasan',
                'tags' => ['Disaster Management', 'Community', 'Cyclone', 'Flood'],
                'read_time' => '4 minutes',
                'views' => 278,
                'is_featured' => false,
                'is_active' => true,
                'full_content' => '<h2>Empowering Communities for Disaster Resilience</h2>
                    <p>Bangladesh is one of the most disaster-prone countries in the world. Community-based disaster preparedness has proven to be one of the most effective approaches to building resilience.</p>
                    
                    <h3>Early Warning Systems</h3>
                    <p>Community-based early warning systems, including cyclone shelters and mobile alerts, have significantly reduced casualties from cyclones and floods.</p>
                    
                    <h3>Local Response Teams</h3>
                    <p>Trained local volunteers form the backbone of disaster response. These teams conduct rescue operations, provide first aid, and assist in evacuation efforts.</p>
                    
                    <h3>Evacuation Planning</h3>
                    <ul>
                        <li>Identification of safe zones and evacuation routes</li>
                        <li>Regular evacuation drills and practice sessions</li>
                        <li>Establishment of temporary shelters</li>
                        <li>Stockpiling of emergency supplies</li>
                    </ul>
                    
                    <h3>Post-Disaster Recovery</h3>
                    <p>Community-led recovery initiatives have proven more effective and sustainable than top-down approaches. These include livelihood restoration, psychological support, and rebuilding infrastructure.</p>'
            ],
            [
                'title' => 'Water Resource Management in Bangladesh',
                'excerpt' => 'Addressing water scarcity and quality issues through integrated management approaches.',
                'date' => '2023-09-01',
                'category' => 'Water Resources',
                'image' => 'https://placehold.co/600x400/3498DB/FFFFFF?text=Water+Resources',
                'pdf_url' => '#',
                'author' => 'Dr. Mahmud',
                'tags' => ['Water Resources', 'Management', 'Scarcity', 'Quality'],
                'read_time' => '5 minutes',
                'views' => 201,
                'is_featured' => false,
                'is_active' => true,
                'full_content' => '<h2>Ensuring Water Security in Bangladesh</h2>
                    <p>Water resource management is critical for Bangladesh\'s development. This research examines the challenges and opportunities in ensuring water security for the country\'s growing population.</p>
                    
                    <h3>Groundwater Depletion</h3>
                    <p>Excessive groundwater extraction for irrigation has led to declining water tables in many areas. Sustainable extraction practices and alternative water sources are needed.</p>
                    
                    <h3>Surface Water Quality</h3>
                    <p>Pollution from industrial and domestic sources has degraded surface water quality. Treatment facilities and pollution control measures are essential for protecting public health.</p>
                    
                    <h3>Water Conservation Strategies</h3>
                    <ul>
                        <li>Rainwater harvesting systems</li>
                        <li>Efficient irrigation methods</li>
                        <li>Wastewater treatment and reuse</li>
                        <li>Watershed management programs</li>
                    </ul>
                    
                    <h3>Integrated Water Resource Management</h3>
                    <p>Adopting an integrated approach that considers all aspects of water management, including supply, quality, and ecosystem protection, is crucial for long-term sustainability.</p>'
            ],
            [
                'title' => 'Urbanization and Environmental Sustainability',
                'excerpt' => 'Examining the environmental challenges of rapid urbanization in Bangladesh.',
                'date' => '2023-10-20',
                'category' => 'Urban Development',
                'image' => 'https://placehold.co/600x400/9B59B6/FFFFFF?text=Urbanization',
                'pdf_url' => '#',
                'author' => 'Dr. Sultana',
                'tags' => ['Urbanization', 'Environment', 'Sustainability', 'City Planning'],
                'read_time' => '4 minutes',
                'views' => 167,
                'is_featured' => false,
                'is_active' => true,
                'full_content' => '<h2>Building Sustainable Cities in Bangladesh</h2>
                    <p>Rapid urbanization is transforming Bangladesh\'s landscape, creating both opportunities and challenges for sustainable development.</p>
                    
                    <h3>Urban Environmental Challenges</h3>
                    <ul>
                        <li>Air and water pollution</li>
                        <li>Waste management problems</li>
                        <li>Loss of green spaces</li>
                        <li>Heat island effects</li>
                    </ul>
                    
                    <h3>Sustainable Urban Planning</h3>
                    <p>Adopting sustainable urban planning approaches can address these challenges. This includes promoting public transport, developing green buildings, and creating urban parks.</p>
                    
                    <h3>Community Participation</h3>
                    <p>Engaging communities in urban planning and environmental management is essential for creating sustainable and livable cities.</p>'
            ],
            [
                'title' => 'Digital Transformation in Education',
                'excerpt' => 'Exploring the impact of digital technologies on education in Bangladesh.',
                'date' => '2023-11-15',
                'category' => 'Education',
                'image' => 'https://placehold.co/600x400/E67E22/FFFFFF?text=Digital+Education',
                'pdf_url' => '#',
                'author' => 'Prof. Khan',
                'tags' => ['Education', 'Digital', 'Technology', 'E-Learning'],
                'read_time' => '4 minutes',
                'views' => 223,
                'is_featured' => false,
                'is_active' => true,
                'full_content' => '<h2>Revolutionizing Education Through Technology</h2>
                    <p>Digital transformation is reshaping education in Bangladesh, offering new opportunities for learning and skill development.</p>
                    
                    <h3>E-Learning Platforms</h3>
                    <p>Online learning platforms have made education more accessible, particularly for students in remote areas. These platforms offer flexibility and personalized learning experiences.</p>
                    
                    <h3>Challenges and Solutions</h3>
                    <ul>
                        <li>Digital divide and internet access</li>
                        <li>Teacher training and digital literacy</li>
                        <li>Content development and quality assurance</li>
                        <li>Assessment and certification</li>
                    </ul>
                    
                    <h3>Future Prospects</h3>
                    <p>Emerging technologies like artificial intelligence and virtual reality have the potential to further transform education, making it more engaging and effective.</p>'
            ],
            [
                'title' => 'Healthcare Innovations for Rural Communities',
                'excerpt' => 'Exploring innovative healthcare solutions for underserved rural populations.',
                'date' => '2023-12-10',
                'category' => 'Healthcare',
                'image' => 'https://placehold.co/600x400/E74C3C/FFFFFF?text=Healthcare+Innovation',
                'pdf_url' => '#',
                'author' => 'Dr. Hossain',
                'tags' => ['Healthcare', 'Rural', 'Innovation', 'Access'],
                'read_time' => '5 minutes',
                'views' => 198,
                'is_featured' => false,
                'is_active' => true,
                'full_content' => '<h2>Transforming Rural Healthcare Delivery</h2>
                    <p>Rural communities in Bangladesh face significant barriers to accessing quality healthcare. This research explores innovative solutions to bridge the healthcare gap.</p>
                    
                    <h3>Telemedicine</h3>
                    <p>Telemedicine services have connected rural patients with specialist doctors in urban centers, reducing the need for travel and improving access to care.</p>
                    
                    <h3>Community Health Workers</h3>
                    <p>Trained community health workers play a vital role in delivering basic healthcare services, health education, and disease prevention programs in rural areas.</p>
                    
                    <h3>Mobile Health Solutions</h3>
                    <ul>
                        <li>Health information apps</li>
                        <li>Mobile diagnostic tools</li>
                        <li>Remote patient monitoring</li>
                        <li>Health awareness campaigns</li>
                    </ul>
                    
                    <h3>Public-Private Partnerships</h3>
                    <p>Collaborations between government, private sector, and NGOs have proven effective in scaling up innovative healthcare solutions in rural areas.</p>'
            ]
        ];

        foreach ($publications as $data) {
            // Generate slug from title if not provided
            if (!isset($data['slug'])) {
                $data['slug'] = Str::slug($data['title']);
            }

            // Ensure uniqueness of slug
            $originalSlug = $data['slug'];
            $counter = 1;
            while (Publication::withTrashed()->where('slug', $data['slug'])->exists()) {
                $data['slug'] = $originalSlug . '-' . $counter;
                $counter++;
            }

            Publication::create($data);
        }

        $this->command->info('Publications seeded successfully!');
    }
}
