import sys
from app.core.database import get_driver, close_driver


def seed_data():
    driver = get_driver()
    
    print("Connecting to Neo4j and seeding expanded data...")
    try:
        with driver.session() as session:
            def _seed(tx):
                # First, clear the database
                tx.run("MATCH (n) DETACH DELETE n")
                
                # Second, seed the data
                query = """
                // Create Franchises
                CREATE (kkr:Franchise {name: 'KKR', purse_remaining_cr: 15.0, remaining_squad_slots: 5})
                CREATE (csk:Franchise {name: 'CSK', purse_remaining_cr: 12.0, remaining_squad_slots: 3})
                CREATE (mi:Franchise {name: 'MI', purse_remaining_cr: 2.0, remaining_squad_slots: 1})
                CREATE (rcb:Franchise {name: 'RCB', purse_remaining_cr: 18.0, remaining_squad_slots: 4})
                CREATE (gt:Franchise {name: 'GT', purse_remaining_cr: 25.0, remaining_squad_slots: 6})
                CREATE (lsg:Franchise {name: 'LSG', purse_remaining_cr: 10.0, remaining_squad_slots: 2})

                // Create Players
                CREATE (rinku:Player {name: 'Rinku Singh', value_cr: 11.0})
                CREATE (hardik:Player {name: 'Hardik Pandya', value_cr: 15.0})
                CREATE (kl:Player {name: 'KL Rahul', value_cr: 14.0})
                CREATE (sky:Player {name: 'Suryakumar Yadav', value_cr: 15.0})
                CREATE (santner:Player {name: 'Mitchell Santner', value_cr: 11.0})
                CREATE (rashid:Player {name: 'Rashid Khan', value_cr: 15.0})

                // Create Journalists
                CREATE (repA:Journalist {name: 'Rep A', correct_rumours: 17, total_rumours: 20, media_outlet: 'Cricbuzz'})
                CREATE (repB:Journalist {name: 'Rep B', correct_rumours: 9, total_rumours: 20, media_outlet: 'ESPNcricinfo'})
                CREATE (repC:Journalist {name: 'Rep C', correct_rumours: 13, total_rumours: 20, media_outlet: 'Sportskeeda'})

                // Create Rumours
                CREATE (rumour1:Rumour {
                    id: 'rumour_1', 
                    content: 'Rinku Singh trading to CSK', 
                    additional_sources: 2,
                    hours_since_update: 6.0,
                    community_yes_votes: 120,
                    community_no_votes: 30,
                    timeline_json: '[{"time": "48 hours ago", "title": "Rumor Surface", "description": "First published by Rep A on social media", "status": "surface", "source": "Rep A / Cricbuzz", "probability": 85.0}, {"time": "24 hours ago", "title": "Independent Backup", "description": "ESPNcricinfo and local journalists backup the claim", "status": "verification", "source": "ESPNcricinfo", "probability": 90.0}, {"time": "6 hours ago", "title": "Purse Check", "description": "CSK confirmed to have 12.0 Cr remaining purse space", "status": "active", "source": "CSK Management", "probability": 91.5}]'
                })
                CREATE (rumour2:Rumour {
                    id: 'rumour_2', 
                    content: 'Hardik Pandya trading to CSK', 
                    additional_sources: 1,
                    hours_since_update: 24.0,
                    community_yes_votes: 10,
                    community_no_votes: 90,
                    timeline_json: '[{"time": "72 hours ago", "title": "Rumor Surface", "description": "Discussions on fan forums about possible transfer to Chennai", "status": "surface", "source": "Forums", "probability": 25.0}, {"time": "48 hours ago", "title": "Low Tier Media Report", "description": "Published by Rep B via online article", "status": "surface", "source": "Rep B", "probability": 45.0}, {"time": "24 hours ago", "title": "Purse Roadblock", "description": "CSK remaining purse checked (12.0 Cr). Budget insufficient for 15.0 Cr valuation", "status": "blocked", "source": "CSK Management", "probability": 5.0}]'
                })
                CREATE (rumour3:Rumour {
                    id: 'rumour_3', 
                    content: 'KL Rahul linking to RCB', 
                    additional_sources: 3,
                    hours_since_update: 12.0,
                    community_yes_votes: 85,
                    community_no_votes: 25,
                    timeline_json: '[{"time": "96 hours ago", "title": "Captaincy Whispers", "description": "RCB scouting for captaincy replacement targets", "status": "surface", "source": "Social Media", "probability": 40.0}, {"time": "48 hours ago", "title": "Advanced Talks", "description": "Rep A reports KL Rahul is in talks with RCB management for leadership role", "status": "verification", "source": "Rep A", "probability": 68.0}, {"time": "12 hours ago", "title": "Contract Proposal", "description": "RCB structure long-term captaincy incentive clauses", "status": "active", "source": "Cricbuzz", "probability": 72.0}]'
                })
                CREATE (rumour4:Rumour {
                    id: 'rumour_4', 
                    content: 'Suryakumar Yadav trading to GT', 
                    additional_sources: 0,
                    hours_since_update: 24.0,
                    community_yes_votes: 40,
                    community_no_votes: 60,
                    timeline_json: '[{"time": "72 hours ago", "title": "GT Trade Inquiry", "description": "GT initiates trade talks for marquee batsman", "status": "surface", "source": "Insider", "probability": 30.0}, {"time": "24 hours ago", "title": "Valuation Dispute", "description": "MI requests multiple players in return to balance valuation, stalling talks", "status": "active", "source": "Rep C", "probability": 38.0}]'
                })

                // Create Player-Franchise plays relationships
                CREATE (rinku)-[:PLAYS_FOR]->(kkr)
                CREATE (hardik)-[:PLAYS_FOR]->(mi)
                CREATE (kl)-[:PLAYS_FOR]->(lsg)
                CREATE (sky)-[:PLAYS_FOR]->(mi)
                CREATE (santner)-[:PLAYS_FOR]->(csk)
                CREATE (rashid)-[:PLAYS_FOR]->(gt)

                // Create Target and Link relationships for active rumors
                CREATE (rinku)-[:TARGET_OF]->(rumour1)
                CREATE (rumour1)-[:LINKED_TO]->(csk)
                CREATE (repA)-[:PUBLISHED]->(rumour1)
                
                CREATE (hardik)-[:TARGET_OF]->(rumour2)
                CREATE (rumour2)-[:LINKED_TO]->(csk)
                CREATE (repB)-[:PUBLISHED]->(rumour2)
                
                CREATE (kl)-[:TARGET_OF]->(rumour3)
                CREATE (rumour3)-[:LINKED_TO]->(rcb)
                CREATE (repA)-[:PUBLISHED]->(rumour3)
                
                CREATE (sky)-[:TARGET_OF]->(rumour4)
                CREATE (rumour4)-[:LINKED_TO]->(gt)
                CREATE (repC)-[:PUBLISHED]->(rumour4)

                // Agents definitions
                CREATE (agentA:Agent {name: 'Ravi Shastri Agency', company: 'RSA Sports', clout_rating: 9.2})
                CREATE (agentB:Agent {name: 'BCCI Alliance Agency', company: 'BAA Management', clout_rating: 8.5})
                CREATE (agentC:Agent {name: 'Elite Talent Group', company: 'ETG Cricket', clout_rating: 7.9})
                
                CREATE (rinku)-[:REPRESENTED_BY]->(agentA)
                CREATE (hardik)-[:REPRESENTED_BY]->(agentB)
                CREATE (kl)-[:REPRESENTED_BY]->(agentA)
                CREATE (sky)-[:REPRESENTED_BY]->(agentC)
                CREATE (santner)-[:REPRESENTED_BY]->(agentC)
                CREATE (rashid)-[:REPRESENTED_BY]->(agentB)
                
                CREATE (agentA)-[:DEALS_WITH]->(kkr)
                CREATE (agentA)-[:DEALS_WITH]->(csk)
                CREATE (agentA)-[:DEALS_WITH]->(rcb)
                CREATE (agentB)-[:DEALS_WITH]->(mi)
                CREATE (agentB)-[:DEALS_WITH]->(gt)
                CREATE (agentC)-[:DEALS_WITH]->(csk)
                CREATE (agentC)-[:DEALS_WITH]->(mi)

                // Historical Sagas
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
                """
                tx.run(query)
                
            session.execute_write(_seed)
            print("Successfully seeded Neo4j database with expanded IPL graph data.")
            
            # Print verification summary
            result = session.run("""
            MATCH (n)
            RETURN labels(n)[0] AS label, count(n) AS count
            """)
            print("\nDatabase Nodes:")
            for record in result:
                print(f"  {record['label']}: {record['count']}")
                
            rel_result = session.run("""
            MATCH ()-[r]->()
            RETURN type(r) AS type, count(r) AS count
            """)
            print("\nDatabase Relationships:")
            for record in rel_result:
                print(f"  {record['type']}: {record['count']}")

    except Exception as e:
        print(f"Error during seeding: {e}", file=sys.stderr)
        sys.exit(1)
    finally:
        close_driver()


if __name__ == "__main__":
    seed_data()
