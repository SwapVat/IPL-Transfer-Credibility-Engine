import sys
from app.core.database import get_driver, close_driver


def seed_data():
    driver = get_driver()
    
    print("Connecting to Neo4j and seeding 10 franchises...")
    try:
        with driver.session() as session:
            def _seed(tx):
                # Clear existing database
                tx.run("MATCH (n) DETACH DELETE n")
                
                # Seed query
                query = """
                // Create Franchises
                CREATE (csk:Franchise {name: 'CSK', purse_remaining_cr: 18.2, remaining_squad_slots: 2})
                CREATE (mi:Franchise {name: 'MI', purse_remaining_cr: 2.0, remaining_squad_slots: 1})
                CREATE (kkr:Franchise {name: 'KKR', purse_remaining_cr: 12.5, remaining_squad_slots: 3})
                CREATE (rcb:Franchise {name: 'RCB', purse_remaining_cr: 24.5, remaining_squad_slots: 6})
                CREATE (gt:Franchise {name: 'GT', purse_remaining_cr: 15.0, remaining_squad_slots: 4})
                CREATE (lsg:Franchise {name: 'LSG', purse_remaining_cr: 32.0, remaining_squad_slots: 7})
                CREATE (dc:Franchise {name: 'DC', purse_remaining_cr: 28.5, remaining_squad_slots: 5})
                CREATE (rr:Franchise {name: 'RR', purse_remaining_cr: 11.2, remaining_squad_slots: 3})
                CREATE (pbks:Franchise {name: 'PBKS', purse_remaining_cr: 45.0, remaining_squad_slots: 10})
                CREATE (srh:Franchise {name: 'SRH', purse_remaining_cr: 9.8, remaining_squad_slots: 2})

                // Create Players
                CREATE (rinku:Player {name: 'Rinku Singh', value_cr: 11.0})
                CREATE (kl:Player {name: 'KL Rahul', value_cr: 14.0})
                CREATE (sky:Player {name: 'Suryakumar Yadav', value_cr: 15.0})
                CREATE (pant:Player {name: 'Rishabh Pant', value_cr: 16.0})
                CREATE (shreyas:Player {name: 'Shreyas Iyer', value_cr: 12.0})
                CREATE (ishan:Player {name: 'Ishan Kishan', value_cr: 10.0})
                CREATE (buttler:Player {name: 'Jos Buttler', value_cr: 13.0})
                CREATE (hardik:Player {name: 'Hardik Pandya', value_cr: 15.0})
                CREATE (green:Player {name: 'Cameron Green', value_cr: 17.5})
                CREATE (padikkal:Player {name: 'Devdutt Padikkal', value_cr: 7.5})

                // Create Journalists
                CREATE (vijay:Journalist {name: 'Vijay Tagore', correct_rumours: 18, total_rumours: 20, media_outlet: 'Cricbuzz', favorite_target: 'CSK', avg_lifespan_days: 3.5, last_active: 'Active 2h ago'})
                CREATE (sandeep:Journalist {name: 'Sandeep Dwivedi', correct_rumours: 15, total_rumours: 20, media_outlet: 'The Indian Express', favorite_target: 'MI', avg_lifespan_days: 5.2, last_active: 'Active 1d ago'})
                CREATE (kanishkaa:Journalist {name: 'Kanishkaa Balachandran', correct_rumours: 12, total_rumours: 20, media_outlet: 'The Hindu', favorite_target: 'RCB', avg_lifespan_days: 4.8, last_active: 'Inactive'})
                CREATE (amol:Journalist {name: 'Amol Karhadkar', correct_rumours: 17, total_rumours: 20, media_outlet: 'Sportstar', favorite_target: 'KKR', avg_lifespan_days: 2.9, last_active: 'Active 4h ago'})
                CREATE (gaurav:Journalist {name: 'Gaurav Gupta', correct_rumours: 14, total_rumours: 20, media_outlet: 'Times of India', favorite_target: 'MI', avg_lifespan_days: 6.1, last_active: 'Active 12h ago'})
                CREATE (rohan:Journalist {name: 'Rohan Sen', correct_rumours: 11, total_rumours: 20, media_outlet: 'India Today', favorite_target: 'DC', avg_lifespan_days: 4.0, last_active: 'Active 1d ago'})
                CREATE (venkata:Journalist {name: 'Venkata Krishna B', correct_rumours: 16, total_rumours: 20, media_outlet: 'The New Indian Express', favorite_target: 'SRH', avg_lifespan_days: 3.2, last_active: 'Active 1h ago'})
                CREATE (devendra:Journalist {name: 'Devendra Pandey', correct_rumours: 13, total_rumours: 20, media_outlet: 'Indian Express', favorite_target: 'GT', avg_lifespan_days: 5.5, last_active: 'Active 8h ago'})
                CREATE (gviswanath:Journalist {name: 'G. Viswanath', correct_rumours: 10, total_rumours: 20, media_outlet: 'The Hindu', favorite_target: 'RR', avg_lifespan_days: 7.0, last_active: 'Inactive'})
                CREATE (shalini:Journalist {name: 'Shalini Gupta', correct_rumours: 8, total_rumours: 20, media_outlet: 'ESPNcricinfo', favorite_target: 'PBKS', avg_lifespan_days: 8.2, last_active: 'Inactive'})
                CREATE (harsha:Journalist {name: 'Harsha Bhogle', correct_rumours: 19, total_rumours: 20, media_outlet: 'Cricbuzz', favorite_target: 'CSK', avg_lifespan_days: 2.1, last_active: 'Active 30m ago'})
                CREATE (boria:Journalist {name: 'Boria Majumdar', correct_rumours: 14, total_rumours: 22, media_outlet: 'RevSportz', favorite_target: 'KKR', avg_lifespan_days: 4.5, last_active: 'Active 5h ago'})
                CREATE (karan:Journalist {name: 'Karan Prasad', correct_rumours: 9, total_rumours: 15, media_outlet: 'Times Now', favorite_target: 'RCB', avg_lifespan_days: 5.0, last_active: 'Active 2d ago'})
                CREATE (subhasish:Journalist {name: 'Subhasish Bose', correct_rumours: 6, total_rumours: 14, media_outlet: 'Sportzwiki', favorite_target: 'LSG', avg_lifespan_days: 6.8, last_active: 'Active 1d ago'})
                CREATE (insider:Journalist {name: 'Cricket Insider', correct_rumours: 8, total_rumours: 18, media_outlet: 'Anonymous', favorite_target: 'MI', avg_lifespan_days: 3.0, last_active: 'Active 3h ago'})

                // Create Active Rumours
                CREATE (rumour1:Rumour {
                    id: 'rumour_1', 
                    content: 'Rinku Singh trading to CSK', 
                    additional_sources: 2,
                    hours_since_update: 6.0,
                    community_yes_votes: 120,
                    community_no_votes: 30,
                    timeline_json: '[{"time": "48 hours ago", "title": "Rumor Surface", "description": "First published by Vijay Tagore on Cricbuzz", "status": "surface", "source": "Vijay Tagore / Cricbuzz", "probability": 85.0}, {"time": "24 hours ago", "title": "Independent Backup", "description": "ESPNcricinfo and local journalists backup the claim", "status": "verification", "source": "ESPNcricinfo", "probability": 90.0}, {"time": "6 hours ago", "title": "Purse Check", "description": "CSK confirmed to have 18.2 Cr remaining purse space", "status": "active", "source": "CSK Management", "probability": 91.5}]'
                })
                CREATE (rumour2:Rumour {
                    id: 'rumour_2', 
                    content: 'KL Rahul linking to RCB', 
                    additional_sources: 3,
                    hours_since_update: 12.0,
                    community_yes_votes: 85,
                    community_no_votes: 25,
                    timeline_json: '[{"time": "96 hours ago", "title": "Captaincy Whispers", "description": "RCB scouting for captaincy replacement targets", "status": "surface", "source": "Social Media", "probability": 40.0}, {"time": "48 hours ago", "title": "Advanced Talks", "description": "Amol Karhadkar reports KL Rahul is in talks with RCB management for leadership role", "status": "verification", "source": "Amol Karhadkar", "probability": 68.0}, {"time": "12 hours ago", "title": "Contract Proposal", "description": "RCB structure long-term captaincy incentive clauses", "status": "active", "source": "Cricbuzz", "probability": 72.0}]'
                })
                CREATE (rumour3:Rumour {
                    id: 'rumour_3', 
                    content: 'Suryakumar Yadav trading to GT', 
                    additional_sources: 0,
                    hours_since_update: 24.0,
                    community_yes_votes: 40,
                    community_no_votes: 60,
                    timeline_json: '[{"time": "72 hours ago", "title": "GT Trade Inquiry", "description": "GT initiates trade talks for marquee batsman", "status": "surface", "source": "Insider", "probability": 30.0}, {"time": "24 hours ago", "title": "Valuation Dispute", "description": "MI requests multiple players in return to balance valuation, stalling talks", "status": "active", "source": "Kanishkaa Balachandran", "probability": 38.0}]'
                })
                CREATE (rumour4:Rumour {
                    id: 'rumour_4', 
                    content: 'Rishabh Pant trading to CSK', 
                    additional_sources: 4,
                    hours_since_update: 8.0,
                    community_yes_votes: 150,
                    community_no_votes: 70,
                    timeline_json: '[{"time": "5 days ago", "title": "Auction Speculation", "description": "CSK scouts express strong interest in Pant should he enter auction", "status": "surface", "source": "Social Media", "probability": 50.0}, {"time": "2 days ago", "title": "DC Renewal Stall", "description": "Negotiations between DC and Pant stall on contract terms", "status": "verification", "source": "Vijay Tagore", "probability": 60.0}, {"time": "8 hours ago", "title": "Auction Entry", "description": "Confirmed entry into auction pool, CSK prepares massive bid", "status": "active", "source": "Cricbuzz", "probability": 65.0}]'
                })
                CREATE (rumour5:Rumour {
                    id: 'rumour_5', 
                    content: 'Shreyas Iyer trading to PBKS', 
                    additional_sources: 2,
                    hours_since_update: 4.0,
                    community_yes_votes: 95,
                    community_no_votes: 15,
                    timeline_json: '[{"time": "3 days ago", "title": "KKR Release", "description": "KKR opts not to retain Iyer", "status": "surface", "source": "Insider", "probability": 70.0}, {"time": "1 day ago", "title": "PBKS Captaincy Search", "description": "PBKS schedules meeting with Iyer to discuss leadership role", "status": "verification", "source": "Amol Karhadkar", "probability": 80.0}, {"time": "4 hours ago", "title": "Advanced Proposal", "description": "PBKS offers record captaincy contract", "status": "active", "source": "Vijay Tagore", "probability": 84.0}]'
                })
                CREATE (rumour6:Rumour {
                    id: 'rumour_6', 
                    content: 'Ishan Kishan trading to LSG', 
                    additional_sources: 1,
                    hours_since_update: 18.0,
                    community_yes_votes: 55,
                    community_no_votes: 45,
                    timeline_json: '[{"time": "48 hours ago", "title": "LSG Inquiry", "description": "LSG expresses interest in keeper-batter role", "status": "surface", "source": "Sportskeeda", "probability": 45.0}, {"time": "18 hours ago", "title": "Trade Talks", "description": "MI and LSG hold preliminary negotiations", "status": "active", "source": "Sandeep Dwivedi", "probability": 55.0}]'
                })
                CREATE (rumour7:Rumour {
                    id: 'rumour_7', 
                    content: 'Jos Buttler trading to RCB', 
                    additional_sources: 1,
                    hours_since_update: 36.0,
                    community_yes_votes: 30,
                    community_no_votes: 70,
                    timeline_json: '[{"time": "72 hours ago", "title": "Buttler Release Speculation", "description": "RR considers other retention priorities", "status": "surface", "source": "Social Media", "probability": 30.0}, {"time": "36 hours ago", "title": "RCB Opening Search", "description": "RCB places Buttler on top priority list", "status": "active", "source": "Kanishkaa Balachandran", "probability": 42.0}]'
                })

                // Create Officially Announced/Completed Trades (Rumours with 100% probability and status: "OFFICIALLY ANNOUNCED")
                CREATE (completed1:Rumour {
                    id: 'completed_1',
                    content: 'Hardik Pandya to MI (2024 Mega Trade)',
                    additional_sources: 5,
                    hours_since_update: 0.0,
                    community_yes_votes: 500,
                    community_no_votes: 0,
                    is_completed: true,
                    status: 'OFFICIALLY ANNOUNCED',
                    verified_outcome: 'COMPLETED',
                    source: 'Official Franchise Statement',
                    timeline_json: '[{"time": "Announced", "title": "Official Transfer Completed", "description": "Hardik Pandya returns to MI via mega trade", "status": "active", "source": "Official Franchise Statement", "probability": 100.0}]'
                })
                CREATE (completed2:Rumour {
                    id: 'completed_2',
                    content: 'Cameron Green to RCB (2024 Cash Trade)',
                    additional_sources: 5,
                    hours_since_update: 0.0,
                    community_yes_votes: 400,
                    community_no_votes: 0,
                    is_completed: true,
                    status: 'OFFICIALLY ANNOUNCED',
                    verified_outcome: 'COMPLETED',
                    source: 'Official IPL Media Portal',
                    timeline_json: '[{"time": "Announced", "title": "Official Cash Transfer", "description": "Cameron Green traded to RCB in all-cash deal", "status": "active", "source": "Official IPL Media Portal", "probability": 100.0}]'
                })
                CREATE (completed3:Rumour {
                    id: 'completed_3',
                    content: 'Devdutt Padikkal to LSG (2024 Trade)',
                    additional_sources: 5,
                    hours_since_update: 0.0,
                    community_yes_votes: 200,
                    community_no_votes: 0,
                    is_completed: true,
                    status: 'OFFICIALLY ANNOUNCED',
                    verified_outcome: 'COMPLETED',
                    source: 'LSG Official Page',
                    timeline_json: '[{"time": "Announced", "title": "Official Swap Trade", "description": "Devdutt Padikkal joins LSG via swap trade deal", "status": "active", "source": "LSG Official Page", "probability": 100.0}]'
                })

                // Relationships (PLAYS_FOR)
                CREATE (rinku)-[:PLAYS_FOR]->(kkr)
                CREATE (sky)-[:PLAYS_FOR]->(mi)
                CREATE (kl)-[:PLAYS_FOR]->(lsg)
                CREATE (pant)-[:PLAYS_FOR]->(dc)
                CREATE (shreyas)-[:PLAYS_FOR]->(kkr)
                CREATE (ishan)-[:PLAYS_FOR]->(mi)
                CREATE (buttler)-[:PLAYS_FOR]->(rr)
                CREATE (hardik)-[:PLAYS_FOR]->(mi)
                CREATE (green)-[:PLAYS_FOR]->(rcb)
                CREATE (padikkal)-[:PLAYS_FOR]->(lsg)

                // Rumour relationships
                CREATE (rinku)-[:TARGET_OF]->(rumour1)
                CREATE (rumour1)-[:LINKED_TO]->(csk)
                CREATE (vijay)-[:PUBLISHED]->(rumour1)

                CREATE (kl)-[:TARGET_OF]->(rumour2)
                CREATE (rumour2)-[:LINKED_TO]->(rcb)
                CREATE (amol)-[:PUBLISHED]->(rumour2)

                CREATE (sky)-[:TARGET_OF]->(rumour3)
                CREATE (rumour3)-[:LINKED_TO]->(gt)
                CREATE (kanishkaa)-[:PUBLISHED]->(rumour3)

                CREATE (pant)-[:TARGET_OF]->(rumour4)
                CREATE (rumour4)-[:LINKED_TO]->(csk)
                CREATE (vijay)-[:PUBLISHED]->(rumour4)

                CREATE (shreyas)-[:TARGET_OF]->(rumour5)
                CREATE (rumour5)-[:LINKED_TO]->(pbks)
                CREATE (amol)-[:PUBLISHED]->(rumour5)

                CREATE (ishan)-[:TARGET_OF]->(rumour6)
                CREATE (rumour6)-[:LINKED_TO]->(lsg)
                CREATE (sandeep)-[:PUBLISHED]->(rumour6)

                CREATE (buttler)-[:TARGET_OF]->(rumour7)
                CREATE (rumour7)-[:LINKED_TO]->(rcb)
                CREATE (kanishkaa)-[:PUBLISHED]->(rumour7)

                // Completed trades target relationships
                CREATE (hardik)-[:TARGET_OF]->(completed1)
                CREATE (completed1)-[:LINKED_TO]->(mi)
                CREATE (vijay)-[:PUBLISHED]->(completed1)

                CREATE (green)-[:TARGET_OF]->(completed2)
                CREATE (completed2)-[:LINKED_TO]->(rcb)
                CREATE (amol)-[:PUBLISHED]->(completed2)

                CREATE (padikkal)-[:TARGET_OF]->(completed3)
                CREATE (completed3)-[:LINKED_TO]->(lsg)
                CREATE (sandeep)-[:PUBLISHED]->(completed3)

                // Representation
                CREATE (agentA:Agent {name: 'Ravi Shastri Agency', company: 'RSA Sports', clout_rating: 9.2})
                CREATE (agentB:Agent {name: 'BCCI Alliance Agency', company: 'BAA Management', clout_rating: 8.5})
                CREATE (agentC:Agent {name: 'Elite Talent Group', company: 'ETG Cricket', clout_rating: 7.9})

                CREATE (rinku)-[:REPRESENTED_BY]->(agentA)
                CREATE (kl)-[:REPRESENTED_BY]->(agentA)
                CREATE (sky)-[:REPRESENTED_BY]->(agentC)
                CREATE (pant)-[:REPRESENTED_BY]->(agentA)
                CREATE (shreyas)-[:REPRESENTED_BY]->(agentB)
                CREATE (ishan)-[:REPRESENTED_BY]->(agentC)
                CREATE (buttler)-[:REPRESENTED_BY]->(agentB)

                CREATE (agentA)-[:DEALS_WITH]->(kkr)
                CREATE (agentA)-[:DEALS_WITH]->(csk)
                CREATE (agentA)-[:DEALS_WITH]->(rcb)
                CREATE (agentB)-[:DEALS_WITH]->(mi)
                CREATE (agentB)-[:DEALS_WITH]->(gt)
                CREATE (agentB)-[:DEALS_WITH]->(pbks)
                CREATE (agentC)-[:DEALS_WITH]->(csk)
                CREATE (agentC)-[:DEALS_WITH]->(mi)

                // Historical ML Backtesting Sagas
                CREATE (:HistoricRumour {
                    id: 'hardik_mi_2024',
                    player: 'Hardik Pandya',
                    franchise: 'MI',
                    year: 2024,
                    final_outcome: 'Confirmed',
                    timeline_json: '[{"date": "Nov 15", "probability": 10.0, "milestone": "Social Media Rumors"}, {"date": "Nov 20", "probability": 35.0, "milestone": "Cricbuzz mentions interest"}, {"date": "Nov 24", "probability": 55.0, "milestone": "GT owner statements"}, {"date": "Nov 26", "probability": 95.0, "milestone": "Official trade submission"}]'
                })
                CREATE (:HistoricRumour {
                    id: 'cameron_green_rcb_2024',
                    player: 'Cameron Green',
                    franchise: 'RCB',
                    year: 2024,
                    final_outcome: 'Confirmed',
                    timeline_json: '[{"date": "Nov 20", "probability": 15.0, "milestone": "Trade rumors leak"}, {"date": "Nov 22", "probability": 40.0, "milestone": "RCB budget allocation adjustments"}, {"date": "Nov 25", "probability": 85.0, "milestone": "Mumbai Indians accept all-cash proposal"}, {"date": "Nov 27", "probability": 100.0, "milestone": "Official IPL board approval"}]'
                })
                CREATE (:HistoricRumour {
                    id: 'rashid_khan_gt_2022',
                    player: 'Rashid Khan',
                    franchise: 'GT',
                    year: 2022,
                    final_outcome: 'Confirmed',
                    timeline_json: '[{"date": "Dec 01", "probability": 20.0, "milestone": "SRH retention release list"}, {"date": "Dec 15", "probability": 50.0, "milestone": "New franchise draft picks discussions"}, {"date": "Jan 10", "probability": 90.0, "milestone": "GT draft contract terms finalized"}, {"date": "Jan 22", "probability": 100.0, "milestone": "Official signing validation"}]'
                })
                CREATE (:HistoricRumour {
                    id: 'padikkal_lsg_2024',
                    player: 'Devdutt Padikkal',
                    franchise: 'LSG',
                    year: 2024,
                    final_outcome: 'Confirmed',
                    timeline_json: '[{"date": "Nov 18", "probability": 25.0, "milestone": "Swap deal discussions initiated"}, {"date": "Nov 20", "probability": 50.0, "milestone": "LSG and RR agree to terms"}, {"date": "Nov 22", "probability": 80.0, "milestone": "Player consent and paperwork completed"}, {"date": "Nov 24", "probability": 100.0, "milestone": "Officially announced by LSG"}]'
                })
                """
                tx.run(query)

            session.execute_write(_seed)
            print("Successfully seeded all 10 franchises and realistic rumors/completed trades.")
            
            # Count details
            result = session.run("MATCH (n) RETURN labels(n)[0] AS label, count(n) AS count")
            for record in result:
                print(f"  {record['label']}: {record['count']}")

    except Exception as e:
        print(f"Seeding Error: {e}", file=sys.stderr)
        sys.exit(1)
    finally:
        close_driver()


if __name__ == "__main__":
    seed_data()
