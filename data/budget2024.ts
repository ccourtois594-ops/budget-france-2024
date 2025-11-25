
import { BudgetData } from '../types';

// Simplified representation of the 2024 Budget (Project de Loi de Finances)
// Figures are in Milliards d'euros (Bn €)
export const budget2024: BudgetData = {
  nodes: [
    // --- COL 0: SEGMENTATION (New) ---
    { name: "Ménages - Revenus Modestes", category: "actor_segmentation" },
    { name: "Ménages - Classes Moyennes", category: "actor_segmentation" },
    { name: "Ménages - Hauts Revenus", category: "actor_segmentation" },
    { name: "TPE & PME", category: "actor_segmentation" },
    { name: "Grandes Entreprises & ETI", category: "actor_segmentation" },
    { name: "Investisseurs Institutionnels", category: "actor_segmentation" },
    { name: "Bailleurs & Actionnaires", category: "actor_segmentation" },

    // --- COL 1: ORIGINS ---
    { name: "Ménages & Particuliers", category: "resource_origin" },
    { name: "Entreprises", category: "resource_origin" },
    { name: "Marchés Financiers", category: "resource_origin" },
    { name: "Divers & Europe", category: "resource_origin" },

    // --- COL 2: RESOURCES (Tax Types) ---
    { name: "TVA", category: "resource" },
    { name: "Impôt sur le Revenu", category: "resource" },
    { name: "Impôt sur les Sociétés", category: "resource" },
    { name: "TICPE (Carburants)", category: "resource" },
    { name: "Autres Recettes Fiscales", category: "resource" },
    { name: "Recettes Non Fiscales", category: "resource" },
    { name: "Déficit / Emprunt", category: "resource" },

    // --- COL 3: CENTRAL ---
    { name: "Budget Général de l'État", category: "intermediate" },

    // --- COL 4: MISSIONS (Dépenses par Ministère/Mission) ---
    { name: "Enseignement Scolaire", category: "expense" },
    { name: "Défense", category: "expense" },
    { name: "Charge de la Dette", category: "expense" },
    { name: "Recherche & Ens. Sup.", category: "expense" },
    { name: "Solidarité & Insertion", category: "expense" },
    { name: "Sécurité", category: "expense" },
    { name: "Justice", category: "expense" },
    { name: "Écologie & Transport", category: "expense" },
    { name: "Collectivités Terr.", category: "expense" },
    { name: "Travail & Emploi", category: "expense" },
    { name: "Autres Missions", category: "expense" }, // Regroupement pour lisibilité

    // --- COL 5: NATURES (Type économique de la dépense) ---
    { name: "Dépenses de Personnel", category: "expense_nature" }, // Titre 2 (Salaires profs, militaires...)
    { name: "Interventions & Transferts", category: "expense_nature" }, // Titre 6 (Allocations, Aides collectivités...)
    { name: "Fonctionnement & Invest.", category: "expense_nature" }, // Titre 3 & 5 (Matériel, Énergie, Bâtiments...)
    { name: "Intérêts Financiers", category: "expense_nature" }, // Charge de la dette pure

    // --- COL 6: DETAILS (Détail fin de la dépense) ---
    { name: "Salaires & Traitements", category: "expense_detail" },
    { name: "Aides aux Ménages", category: "expense_detail" },
    { name: "Aides aux Entreprises", category: "expense_detail" },
    { name: "Dotations Collectivités", category: "expense_detail" },
    { name: "Contribution UE", category: "expense_detail" },
    { name: "Armement & Équipement", category: "expense_detail" },
    { name: "Infra. & Immobilier", category: "expense_detail" },
    { name: "Fonctionnement Services", category: "expense_detail" },
    { name: "Intérêts de la Dette", category: "expense_detail" },
  ],
  links: [
    // === FLOW: SEGMENTATION -> ORIGINS (Col 0 -> Col 1) ===
    // Ménages (Total ~173 Md€ impactés)
    // Hypothèse de répartition : Modestes paient surtout TVA/TICPE, Aisés paient gros IR
    { source: "Ménages - Revenus Modestes", target: "Ménages & Particuliers", value: 45.0 }, // Surtout TVA conso
    { source: "Ménages - Classes Moyennes", target: "Ménages & Particuliers", value: 58.0 }, // Mix IR/TVA
    { source: "Ménages - Hauts Revenus", target: "Ménages & Particuliers", value: 70.0 }, // Gros IR + TVA

    // Entreprises (Total ~145 Md€)
    { source: "TPE & PME", target: "Entreprises", value: 55.0 },
    { source: "Grandes Entreprises & ETI", target: "Entreprises", value: 90.0 },

    // Marchés (Total 144 Md€)
    { source: "Investisseurs Institutionnels", target: "Marchés Financiers", value: 144.0 },

    // Divers (Total 18 Md€)
    { source: "Bailleurs & Actionnaires", target: "Divers & Europe", value: 18.0 },

    // === FLOW: ORIGINS -> RESOURCES (Col 1 -> Col 2) ===
    // Ménages
    { source: "Ménages & Particuliers", target: "Impôt sur le Revenu", value: 88.0 },
    { source: "Ménages & Particuliers", target: "TVA", value: 65.0 }, // Env 65% de la TVA portée par les ménages
    { source: "Ménages & Particuliers", target: "TICPE (Carburants)", value: 10.0 },
    { source: "Ménages & Particuliers", target: "Autres Recettes Fiscales", value: 10.0 },

    // Entreprises
    { source: "Entreprises", target: "Impôt sur les Sociétés", value: 72.0 },
    { source: "Entreprises", target: "TVA", value: 35.0 }, // TVA non déductible etc.
    { source: "Entreprises", target: "TICPE (Carburants)", value: 6.0 },
    { source: "Entreprises", target: "Autres Recettes Fiscales", value: 28.0 }, // CVAE, CFE, taxes prod...
    { source: "Entreprises", target: "Impôt sur le Revenu", value: 4.0 }, // Part residual ou prélèvement forfaitaire

    // Marchés Financiers
    { source: "Marchés Financiers", target: "Déficit / Emprunt", value: 144.0 },

    // Divers
    { source: "Divers & Europe", target: "Recettes Non Fiscales", value: 18.0 }, // Dividendes, amendes...
    
    // === FLOW: RESOURCES -> BUDGET (Col 2 -> Col 3) ===
    { source: "TVA", target: "Budget Général de l'État", value: 100.0 },
    { source: "Impôt sur le Revenu", target: "Budget Général de l'État", value: 92.0 },
    { source: "Impôt sur les Sociétés", target: "Budget Général de l'État", value: 72.0 },
    { source: "TICPE (Carburants)", target: "Budget Général de l'État", value: 16.0 },
    { source: "Autres Recettes Fiscales", target: "Budget Général de l'État", value: 38.0 },
    { source: "Recettes Non Fiscales", target: "Budget Général de l'État", value: 18.0 },
    { source: "Déficit / Emprunt", target: "Budget Général de l'État", value: 144.0 },

    // === FLOW: BUDGET -> MISSIONS (Col 3 -> Col 4) ===
    { source: "Budget Général de l'État", target: "Enseignement Scolaire", value: 64.0 },
    { source: "Budget Général de l'État", target: "Charge de la Dette", value: 56.0 },
    { source: "Budget Général de l'État", target: "Défense", value: 47.0 },
    { source: "Budget Général de l'État", target: "Recherche & Ens. Sup.", value: 31.0 },
    { source: "Budget Général de l'État", target: "Solidarité & Insertion", value: 30.0 },
    { source: "Budget Général de l'État", target: "Écologie & Transport", value: 25.0 },
    { source: "Budget Général de l'État", target: "Sécurité", value: 17.0 },
    { source: "Budget Général de l'État", target: "Travail & Emploi", value: 18.0 },
    { source: "Budget Général de l'État", target: "Justice", value: 10.0 },
    { source: "Budget Général de l'État", target: "Collectivités Terr.", value: 4.5 },
    { source: "Budget Général de l'État", target: "Autres Missions", value: 177.5 },

    // === FLOW: MISSIONS -> NATURES (Col 4 -> Col 5) ===
    
    // 1. Enseignement Scolaire
    { source: "Enseignement Scolaire", target: "Dépenses de Personnel", value: 60.0 },
    { source: "Enseignement Scolaire", target: "Fonctionnement & Invest.", value: 4.0 },

    // 2. Défense
    { source: "Défense", target: "Dépenses de Personnel", value: 21.0 },
    { source: "Défense", target: "Fonctionnement & Invest.", value: 26.0 },

    // 3. Charge de la Dette
    { source: "Charge de la Dette", target: "Intérêts Financiers", value: 56.0 },

    // 4. Recherche
    { source: "Recherche & Ens. Sup.", target: "Dépenses de Personnel", value: 18.0 },
    { source: "Recherche & Ens. Sup.", target: "Interventions & Transferts", value: 8.0 },
    { source: "Recherche & Ens. Sup.", target: "Fonctionnement & Invest.", value: 5.0 },

    // 5. Solidarité
    { source: "Solidarité & Insertion", target: "Interventions & Transferts", value: 28.0 },
    { source: "Solidarité & Insertion", target: "Dépenses de Personnel", value: 2.0 },

    // 6. Sécurité
    { source: "Sécurité", target: "Dépenses de Personnel", value: 14.5 },
    { source: "Sécurité", target: "Fonctionnement & Invest.", value: 2.5 },

    // 7. Justice
    { source: "Justice", target: "Dépenses de Personnel", value: 6.5 },
    { source: "Justice", target: "Fonctionnement & Invest.", value: 3.5 },

    // 8. Écologie
    { source: "Écologie & Transport", target: "Interventions & Transferts", value: 10.0 },
    { source: "Écologie & Transport", target: "Fonctionnement & Invest.", value: 15.0 },

    // 9. Travail
    { source: "Travail & Emploi", target: "Interventions & Transferts", value: 16.0 },
    { source: "Travail & Emploi", target: "Dépenses de Personnel", value: 2.0 },
    
    // 10. Collectivités
    { source: "Collectivités Terr.", target: "Interventions & Transferts", value: 4.5 },

    // 11. Autres Missions
    { source: "Autres Missions", target: "Interventions & Transferts", value: 80.0 },
    { source: "Autres Missions", target: "Dépenses de Personnel", value: 30.0 },
    { source: "Autres Missions", target: "Fonctionnement & Invest.", value: 67.5 },

    // === FLOW: NATURES -> DETAILS (Col 5 -> Col 6) ===
    
    // De Dépenses de Personnel (Total ~154) -> Salaires
    { source: "Dépenses de Personnel", target: "Salaires & Traitements", value: 154.0 },

    // De Interventions & Transferts (Total ~146.5) -> Ventilation
    { source: "Interventions & Transferts", target: "Aides aux Ménages", value: 40.0 }, // APL, Prime activité...
    { source: "Interventions & Transferts", target: "Aides aux Entreprises", value: 35.0 }, // Apprentissage, Guichet énergie...
    { source: "Interventions & Transferts", target: "Dotations Collectivités", value: 45.0 }, // DGF, TVA régions...
    { source: "Interventions & Transferts", target: "Contribution UE", value: 26.5 }, // Prélèvement sur recettes

    // De Fonctionnement & Invest. (Total ~123.5) -> Ventilation
    { source: "Fonctionnement & Invest.", target: "Armement & Équipement", value: 20.0 }, // Programmes 146
    { source: "Fonctionnement & Invest.", target: "Infra. & Immobilier", value: 30.0 }, // Routes, Ferroviaire, Bâtiments État
    { source: "Fonctionnement & Invest.", target: "Fonctionnement Services", value: 73.5 }, // Informatique, Énergie, Fournitures...

    // De Intérêts Financiers (Total 56) -> Dette
    { source: "Intérêts Financiers", target: "Intérêts de la Dette", value: 56.0 },
  ]
};

export const getBudgetSummary = () => {
  const totalResources = budget2024.links
    .filter(l => l.target === "Budget Général de l'État")
    .reduce((acc, curr) => acc + curr.value, 0);

  return `Le Budget de l'État Français pour 2024 représente environ ${totalResources} milliards d'euros. 
  
  Le flux démarre par une segmentation socio-économique (Ménages modestes vs Aisés, PME vs Grandes Entreprises).
  Ces segments alimentent les catégories d'acteurs (Ménages, Entreprises), qui paient les **Impôts** (TVA, IR, IS).
  Ces ressources financent le Budget Général, qui est réparti par **Missions**, puis **Nature**, et enfin **Détaillé**.

  Points clés :
  - La contribution des Grandes Entreprises et des Hauts Revenus est déterminante pour l'IR et l'IS.
  - La TVA pèse sur tous les types de ménages.
  - Le Déficit (marchés financiers) reste une source majeure (~144 Md€).`;
}
