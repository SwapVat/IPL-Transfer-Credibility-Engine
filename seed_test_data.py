import sys
from app.core.database import get_driver, close_driver


def seed_data():
    driver = get_driver()
    
    # Cypher query to clear database and seed data
    cypher_query = """
    // Clear existing data
    MATCH (n) DETACH DELETE n;
    
    // Create Players
    CREATE (rinku:Player {name: 'Rinku Singh'})
    CREATE (hardik:Player {name: 'Hardik Pandya'})
    
    // Create Franchises
    CREATE (kkr:Franchise {name: 'KKR'})
    CREATE (csk:Franchise {name: 'CSK'})
    CREATE (mi:Franchise {name: 'MI'})
    
    // Create Journalists
    CREATE (repA:Journalist {name: 'Rep A', accuracy: 0.85})
    CREATE (repB:Journalist {name: 'Rep B', accuracy: 0.45})
    
    // Create Rumours
    CREATE (rumour1:Rumour {
        id: 'rumour_1', 
        content: 'Rinku Singh trading to CSK', 
        timestamp: timestamp()
    })
    CREATE (rumour2:Rumour {
        id: 'rumour_2', 
        content: 'Hardik Pandya returning to MI', 
        timestamp: timestamp()
    })
    
    // Create Relationships
    CREATE (rinku)-[:TARGET_OF]->(rumour1)
    CREATE (rumour1)-[:LINKED_TO]->(csk)
    CREATE (repA)-[:PUBLISHED]->(rumour1)
    
    CREATE (hardik)-[:TARGET_OF]->(rumour2)
    CREATE (rumour2)-[:LINKED_TO]->(mi)
    CREATE (repB)-[:PUBLISHED]->(rumour2)
    
    RETURN rinku, hardik, kkr, csk, mi, repA, repB, rumour1, rumour2
    """
    
    print("Connecting to Neo4j and seeding data...")
    try:
        with driver.session() as session:
            # Cypher transactions are best executed inside write_transaction or execute_write
            def _seed(tx):
                # Since Neo4j python driver 5.x uses tx.run, we execute the query
                # To execute multiple statements in one query, they must be separated by semicolons (supported by some Neo4j drivers/sessions)
                # But Cypher doesn't allow multiple distinct blocks with semicolons in a single run statement unless we split them or run them as a single transaction block.
                # Actually, Neo4j driver's session.run() only supports a single Cypher statement.
                # Let's split them into individual CREATE statements or run a combined CREATE statement without DETACH DELETE, 
                # or run DETACH DELETE first, then run a single massive CREATE statement with multiple CREATE clauses.
                # Let's write it as a single CREATE query without semicolons to be safe.
                
                # First, clear the database
                tx.run("MATCH (n) DETACH DELETE n")
                
                # Second, seed the data
                query = """
                CREATE (rinku:Player {name: 'Rinku Singh', value_cr: 11.0})
                CREATE (hardik:Player {name: 'Hardik Pandya', value_cr: 15.0})
                CREATE (santner:Player {name: 'Mitchell Santner', value_cr: 11.0})
                CREATE (sky:Player {name: 'Suryakumar Yadav', value_cr: 15.0})
                CREATE (rashid:Player {name: 'Rashid Khan', value_cr: 15.0})
                CREATE (kkr:Franchise {name: 'KKR', purse_remaining_cr: 15.0, remaining_squad_slots: 5})
                CREATE (csk:Franchise {name: 'CSK', purse_remaining_cr: 12.0, remaining_squad_slots: 3})
                CREATE (mi:Franchise {name: 'MI', purse_remaining_cr: 2.0, remaining_squad_slots: 1})
                CREATE (gt:Franchise {name: 'GT', purse_remaining_cr: 25.0, remaining_squad_slots: 4})
                CREATE (repA:Journalist {name: 'Rep A', correct_rumours: 17, total_rumours: 20, media_outlet: 'Cricbuzz'})
                CREATE (repB:Journalist {name: 'Rep B', correct_rumours: 9, total_rumours: 20, media_outlet: 'ESPNcricinfo'})
                CREATE (repC:Journalist {name: 'Rep C', correct_rumours: 13, total_rumours: 20, media_outlet: 'Sportskeeda'})
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
                    content: 'Hardik Pandya returning to MI', 
                    additional_sources: 1,
                    hours_since_update: 48.0,
                    community_yes_votes: 10,
                    community_no_votes: 90,
                    timeline_json: '[{"time": "72 hours ago", "title": "Rumor Surface", "description": "Discussions on fan forums about possible return", "status": "surface", "source": "Forums", "probability": 25.0}, {"time": "48 hours ago", "title": "Low Tier Media Report", "description": "Published by Rep B via online article", "status": "surface", "source": "Rep B", "probability": 45.0}, {"time": "24 hours ago", "title": "Financial Roadblock", "description": "MI remaining purse checked (2.0 Cr). Budget too low", "status": "blocked", "source": "MI Management", "probability": 5.0}]'
                })
                CREATE (rumour3:Rumour {
                    id: 'rumour_3', 
                    content: 'Rinku Singh staying at KKR', 
                    additional_sources: 0,
                    hours_since_update: 12.0,
                    community_yes_votes: 50,
                    community_no_votes: 50,
                    timeline_json: '[{"time": "24 hours ago", "title": "Rumor Surface", "description": "Published by Rep C stating KKR will retain Rinku Singh", "status": "surface", "source": "Rep C / Sportskeeda", "probability": 65.0}, {"time": "12 hours ago", "title": "Active Discussions", "description": "KKR reported to offer maximum slab retention fee", "status": "active", "source": "KKR Management", "probability": 63.4}]'
                })
                CREATE (rinku)-[:TARGET_OF]->(rumour1)
                CREATE (rumour1)-[:LINKED_TO]->(csk)
                CREATE (repA)-[:PUBLISHED]->(rumour1)
                
                CREATE (hardik)-[:TARGET_OF]->(rumour2)
                CREATE (rumour2)-[:LINKED_TO]->(mi)
                CREATE (repB)-[:PUBLISHED]->(rumour2)
                
                CREATE (rinku)-[:TARGET_OF]->(rumour3)
                CREATE (rumour3)-[:LINKED_TO]->(kkr)
                CREATE (repC)-[:PUBLISHED]->(rumour3)
                
                CREATE (rinku)-[:PLAYS_FOR]->(kkr)
                CREATE (hardik)-[:PLAYS_FOR]->(gt)
                CREATE (santner)-[:PLAYS_FOR]->(csk)
                CREATE (sky)-[:PLAYS_FOR]->(mi)
                CREATE (rashid)-[:PLAYS_FOR]->(gt)
                
                CREATE (agentA:Agent {name: 'Ravi Shastri Agency', company: 'RSA Sports', clout_rating: 9.2})
                CREATE (agentB:Agent {name: 'BCCI Alliance Agency', company: 'BAA Management', clout_rating: 8.5})
                CREATE (agentC:Agent {name: 'Elite Talent Group', company: 'ETG Cricket', clout_rating: 7.9})
                
                CREATE (rinku)-[:REPRESENTED_BY]->(agentA)
                CREATE (hardik)-[:REPRESENTED_BY]->(agentB)
                CREATE (santner)-[:REPRESENTED_BY]->(agentC)
                CREATE (sky)-[:REPRESENTED_BY]->(agentC)
                CREATE (rashid)-[:REPRESENTED_BY]->(agentB)
                
                CREATE (agentA)-[:DEALS_WITH]->(kkr)
                CREATE (agentA)-[:DEALS_WITH]->(csk)
                CREATE (agentB)-[:DEALS_WITH]->(mi)
                CREATE (agentB)-[:DEALS_WITH]->(gt)
                CREATE (agentC)-[:DEALS_WITH]->(csk)
                CREATE (agentC)-[:DEALS_WITH]->(mi)

                CREATE (:HistoricRumour {
                    id: 'hardik_mi_2024',
                    player: 'Hardik Pandya',
                    franchise: 'MI',
                    year: 2024,
                    final_outcome: 'Confirmed',
                    timeline_json: '[{"date": "Nov 15", "probability": 10.0, "milestone": "Social Media Rumors"}, {"date": "Nov 20", "probability": 35.0, "milestone": "Cricbuzz mentions interest"}, {"date": "Nov 24", "probability": 55.0, "milestone": "GT owner statements"}, {"date": "Nov 26", "probability": 95.0, "milestone": "Official trade submission"}]'
                })
                CREATE (:HistoricRumour {
                    id: 'kl_lsg_2022',
                    player: 'KL Rahul',
                    franchise: 'LSG',
                    year: 2022,
                    final_outcome: 'Confirmed',
                    timeline_json: '[{"date": "Dec 10", "probability": 20.0, "milestone": "Release by PBKS"}, {"date": "Dec 20", "probability": 45.0, "milestone": "LSG approach leak"}, {"date": "Jan 05", "probability": 75.0, "milestone": "Draft picking agreement"}, {"date": "Jan 15", "probability": 100.0, "milestone": "Contract Signing Announcement"}]'
                })
                """
                tx.run(query)
                
            session.execute_write(_seed)
            print("Successfully seeded Neo4j database with test IPL graph data.")
            
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
