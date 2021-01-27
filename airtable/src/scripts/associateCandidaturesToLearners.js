// Créer des comptes apprenants Crossknowledge

// Repeter pour digitall digistart digitous
// 1. recuperation de la vue Nouvelle
// 2. Comparaison avec la table Apprenant (algo lenvenstein)
// 3. Montrer les record concordant avec un certain pourcentage
// 4. Action: 1.passer ou 2.lier
// 4.1.1 Suivant
// 4.2.1 Action: choisir les records "input.recordAsync" sur concordant
// 4.2.2 Lier candidature à apprenant

// const { scenarioSearchDuplicates } = require("../utils/association/scenario");
const { distanceRatio } = require("../utils/association/ratioProcessing");
const {
  translateApplicantKeys,
  translateLearnerKeys,
  getRatioExtension,
  ACCEPTATION_RATIO,
} = require("../utils/association/tools");
const { makeUpdateRecord, loadView } = require("../utils/model");
// retirer le block de la fonction dabs la version build du script pour pouvoir lexecuter dans airtable
(async () => {
  const config = input.config({
    title:
      "Configuration de l'association des candidatures DigitAll, DigitStart et DigitTous à leurs apprenants",
    description:
      "Ce script permet de lier une candidature DigitAll, DigitStart ou DigitTous à sa correspondance dans la table Apprenants. Les paramètres ci-dessous servent à trouver les informations requises à la bonne exécution du script (Il n'est pas nécessaire d'y toucher).",
    items: [
      // Apprenants
      input.config.table("apprenantsTable", {
        label: "📦 Table des apprenants",
      }),
      input.config.view("apprenantsView", {
        label: "👓 Vue des apprenants",
        parentTable: "apprenantsTable",
      }),
      input.config.field("apprenantsEmail", {
        label: "🏷️ Champ email des apprenants",
        parentTable: "apprenantsTable",
      }),
      input.config.field("apprenantsFirstname", {
        label: "🏷️ Champ prénom des apprenants",
        parentTable: "apprenantsTable",
      }),
      input.config.field("apprenantsLastname", {
        label: "🏷️ Champ nom des apprenants",
        parentTable: "apprenantsTable",
      }),
      input.config.field("apprenantsPhone", {
        label: "🏷️ Champ téléphone des apprenants",
        parentTable: "apprenantsTable",
      }),
      // Candidatures DigitAll et DigiStart
      input.config.table("candidaturesASTable", {
        label: "📦 Table des candidatures digitAll & digiStart",
      }),
      input.config.view("nouvelleAllView", {
        label: "👓 Vue des candidatures digitAll",
        parentTable: "candidaturesASTable",
      }),
      input.config.view("nouvelleStartView", {
        label: "👓 Vue des candidatures digitStart",
        parentTable: "candidaturesASTable",
      }),
      input.config.field("candidaturesASEmail", {
        label: "🏷️ Champ email des candidatures",
        parentTable: "candidaturesASTable",
      }),
      input.config.field("candidaturesASFirstname", {
        label: "🏷️ Champ prénom des candidatures",
        parentTable: "candidaturesASTable",
      }),
      input.config.field("candidaturesASLastname", {
        label: "🏷️ Champ nom des candidatures",
        parentTable: "candidaturesASTable",
      }),
      input.config.field("candidaturesASPhone", {
        label: "🏷️ Champ téléphone des candidatures",
        parentTable: "candidaturesASTable",
      }),
      input.config.field("candidaturesASLearners", {
        label: "🏷️ Champ fiche apprenants des candidatures",
        parentTable: "candidaturesASTable",
      }),
      // Candidatures DigiTous
      input.config.table("candidaturesASTableDigiTous", {
        label: "📦 Table des candidatures DigiTous",
      }),
      input.config.view("nouvelleTousView", {
        label: "👓 Vue des candidatures DigiTous",
        parentTable: "candidaturesASTableDigiTous",
      }),
      input.config.field("candidaturesASLearnersDigiTous", {
        label: "🏷️ Champ fiche apprenants des candidatures",
        parentTable: "candidaturesASTableDigiTous",
      }),
      input.config.field("candidaturesASEmailDigiTous", {
        label: "🏷️ Champ email des candidatures DigiTous",
        parentTable: "candidaturesASTableDigiTous",
      }),
      input.config.field("candidaturesASFirstnameDigiTous", {
        label: "🏷️ Champ prénom des candidatures DigiTous",
        parentTable: "candidaturesASTableDigiTous",
      }),
      input.config.field("candidaturesASLastnameDigiTous", {
        label: "🏷️ Champ nom des candidatures DigiTous",
        parentTable: "candidaturesASTableDigiTous",
      }),
      input.config.field("candidaturesASPhoneDigiTous", {
        label: "🏷️ Champ téléphone des candidatures DigiTous",
        parentTable: "candidaturesASTableDigiTous",
      }),
    ],
  });

  output.markdown("### Association candidatures apprenants");

  // initialisation
  // Definition du modele commun de données
  const ModelDigitAllStart = {
    lastName: config.candidaturesASLastname,
    firstName: config.candidaturesASFirstname,
    email: config.candidaturesASEmail,
    phone: config.candidaturesASPhone,
    learners: config.candidaturesASLearners,
  };
  const ModelDigitTous = {
    lastName: config.candidaturesASLastnameDigiTous,
    firstName: config.candidaturesASFirstnameDigiTous,
    email: config.candidaturesASEmailDigiTous,
    phone: config.candidaturesASPhoneDigiTous,
    learners: config.candidaturesASLearnersDigiTous,
  };
  const ModelLearner = {
    lastName: config.apprenantsLastname,
    firstName: config.apprenantsFirstname,
    email: config.apprenantsEmail,
    phone: config.apprenantsPhone,
  };

  const learnerInfos = {
    table: config.apprenantsTable,
    view: config.apprenantsView,
    model: ModelLearner,
  };
  const applicantsInfos = [
    {
      table: config.candidaturesASTable,
      view: config.nouvelleAllView,
      model: ModelDigitAllStart,
      bind: makeUpdateRecord(
        config.candidaturesASTable,
        ModelDigitAllStart.learners
      ),
    },
    {
      table: config.candidaturesASTable,
      view: config.nouvelleStartView,
      model: ModelDigitAllStart,
      bind: makeUpdateRecord(
        config.candidaturesASTable,
        ModelDigitAllStart.learners
      ),
    },
    {
      table: config.candidaturesASTableDigiTous,
      view: config.nouvelleTousView,
      model: ModelDigitTous,
      bind: makeUpdateRecord(
        config.candidaturesASTableDigiTous,
        ModelDigitTous.learners
      ),
    },
  ];

  // recuperation des apprenants
  const learnerLoaded = await loadView(learnerInfos);
  const { data: learnersData, records: learnersRecord } = learnerLoaded;

  // recuperation nouvelle digitAll; digitStart, DigiTous
  const applicantsLoadedFiltered = (
    await Promise.all(applicantsInfos.map(loadView))
  )
    // filtrage des record si deja liés
    .map((view) => {
      const indexFiltered = [];
      const dataFiltered = view.data.filter(({ learners }, i) => {
        if (learners && learners.length > 0) {
          return false;
        }
        indexFiltered.push(i);
        return true;
      });
      const recordsFiltered = view.records.filter((_, i) =>
        indexFiltered.includes(i)
      );
      return {
        ...view,
        data: dataFiltered,
        records: recordsFiltered,
      };
    })
    .map((acc, { data, ...others }) => {
      const learnersFiltred = data.map((applicantData) => {
        // compare apprenant/candidature
        const learnersRatio = learnersData.map((learnerData) =>
          distanceRatio(learnerData, applicantData)
        );

        // filtrage des apprenant respectant la condition et inclusion des données, du record...
        return learnersRatio.reduce((acc, ratio, i) => {
          if (ratio >= ACCEPTATION_RATIO) {
            return [
              ...acc,
              { i, ratio, data: learnersData[i], record: learnersRecord[i] },
            ];
          }
          return acc;
        }, []);
      });
      return [
        ...acc,
        {
          ...others,
          data,
          learners: learnersFiltred,
        },
      ];
    });

  output.markdown(
    `ℹ️ Nous avons trouvé ${applicantsLoadedFiltered.reduce(
      (acc, { records }) => acc + records.length,
      0
    )} nouvelles candidatures à vérifier, soi:`
  );
  applicantsLoadedFiltered.forEach((load, i) =>
    output.markdown(
      `- ${load.records.length} pour "${applicantsInfos[i].view.name}" de "${applicantsInfos[i].table.name}".`
    )
  );

  output.markdown(
    `ℹ️ Pour rappel si aucune équivalence est trouvée, alors nous passerons à la candidature suivante.`
  );

  for (const j in applicantsLoadedFiltered) {
    const {
      data: applicantsData,
      records: applicantsRecords,
      bind,
    } = applicantsLoadedFiltered[j];
    for (const i in applicantsData) {
      // todo: passé si la candidature a deja été liée à cet apprenant
      const applicantData = applicantsData[i];
      const applicantsRecord = applicantsRecords[i];

      output.markdown(`---
      Voici le candidat ${Number(i) + 1}/${
        applicantsData.length
      } à comparer: `);
      output.table(translateApplicantKeys(applicantData));
      output.text("👩🏽‍🎓 Apprenants correspondants trouvés");
      output.table(
        learnersFiltred.map(({ ratio, data, record }) => ({
          Identifiant: record.name,
          ...translateLearnerKeys(data),
          Correspondance:
            (ratio * 100).toFixed(0) + "%" + getRatioExtension(ratio),
        }))
      );

      // tant qu'aucun champ selectionné, boucler (cela permet de redemander si l'utilisateur souhaite lier le champ au cas ou il quitte la selection sans choisir de champ)
      let response = await input.buttonsAsync(
        "Souhaitez-vous associer la 🙋‍♂️ candidature avec l'un de ces 👩🏽‍🎓 apprenants",
        [
          { label: "Passer", value: "Passer", variant: "secondary" },
          ...learnersFiltred.map(({ record }) => ({
            label: record.name,
            value: record,
          })),
        ]
      );
      if (response !== "Passer") {
        await bind(applicantsRecord, [response]);
        output.text(
          "✅ La 🙋‍♂️ candidature a été associée à 👩🏽‍🎓 l'apprenant sélectionné "
        );
      } else {
        output.text("☑ On passe au suivant");
        break; // sortie du while
      }
    }
  }
  output.markdown("✅ Toutes les candidatures ont été vérifiées.");
})();
