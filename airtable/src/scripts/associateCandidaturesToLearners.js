// Créer des comptes apprenants Crossknowledge

// Repeter pour digitall digistart digitous
// 1. recuperation de la vue Nouvelle
// 2. Comparaison avec la table Apprenant (algo lenvenstein)
// 3. Montrer les record concordant avec un certain pourcentage
// 4. Action: 1.passer ou 2.lier
// 4.1.1 Suivant
// 4.2.1 Action: choisir les records "input.recordAsync" sur concordant
// 4.2.2 Lier candidature à apprenant

const { scenarioSearchDuplicates } = require("../utils/association/scenario");

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
        label: "📦 Table des candidatures digiTous",
      }),
      input.config.view("nouvelleTousView", {
        label: "👓 Vue des candidatures digiTous",
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
  // Fonction préparant une méthode joignant une candidature à un apprenant
  const makeBinder = (applicantTable, applicantLearnerField) => (
    applicantRecord,
    learnerRecord
  ) =>
    applicantTable.updateRecordAsync(applicantRecord, {
      [applicantLearnerField.id]: [learnerRecord],
    });

  const applicantsInfos = [
    {
      table: config.candidaturesASTable,
      view: config.nouvelleAllView,
      model: ModelDigitAllStart,
      bind: makeBinder(config.candidaturesASTable, ModelDigitAllStart.learner),
    },
    {
      table: config.candidaturesASTable,
      view: config.nouvelleStartView,
      model: ModelDigitAllStart,
      bind: makeBinder(config.candidaturesASTable, ModelDigitAllStart.learner),
    },
    {
      table: config.candidaturesASTableDigiTous,
      view: config.nouvelleTousView,
      model: ModelDigitTous,
      bind: makeBinder(
        config.candidaturesASTableDigiTous,
        ModelDigitTous.learner
      ),
    },
  ];
  const learnerInfos = {
    table: config.apprenantsTable,
    view: config.apprenantsView,
    model: ModelLearner,
    bind: makeBinder(config.apprenantsTable, ModelLearner.learner),
  };

  // permet de transformer un record en données selon son model
  const transformRecordToData = (model) => (record) =>
    Object.keys(model).reduce(
      (acc, key) => ({
        ...acc,
        [key]: record.getCellValue(model[key]),
      }),
      {}
    );
  const loadView = async ({ view, model, bind }) => {
    const { records } = await view.selectRecordsAsync();
    const data = records.map(transformRecordToData(model));
    output.markdown(`✅ Vue "${view.name}" chargée.`);
    return {
      records,
      data,
      bind,
    };
  };

  // recuperation des apprenants
  const learnerLoaded = await loadView(learnerInfos);
  // recuperation nouvelle digitAll; digitStart, digiTous
  const applicantsLoaded = await Promise.all(applicantsInfos.map(loadView));
  const applicantsLoadedFiltered = applicantsLoaded.map((view) => {
    // filtrage des record si deja liés
    const indexFiltered = [];
    const dataFiltered = view.data.filter(({ learners, i }) => {
      if (learners) {
        return false;
      }
      indexFiltered.push(i);
      return true;
    });
    const recordsFiltered = view.records.filter(
      (_, i) => !indexFiltered.includes(i)
    );
    return {
      ...view,
      data: dataFiltered,
      records: recordsFiltered,
    };
  });

  output.markdown(
    `ℹ️ Nous avons trouvé ${applicantsLoadedFiltered.reduce(
      (acc, { records }) => acc + records.length,
      0
    )} nouvelles candidatures à vérifier, soi:`
  );
  applicantsLoadedFiltered.forEach((load, i) => {
    output.markdown(
      `- ${load.records.length} pour "${applicantsInfos[i].view.name}".`
    );
  });

  output.markdown(
    `ℹ️ Pour rappel si aucune équivalence est trouvée, alors nous passerons à la candidature suivante. *On passera prochainement les candidats déjà liés à au moins un apprenant.*`
  );

  for (const j in applicantsLoadedFiltered) {
    const loadedApplicantsView = applicantsLoadedFiltered[j];
    await scenarioSearchDuplicates(loadedApplicantsView, learnerLoaded);
  }
  output.markdown("✅ Tous les records ont été vérifiés.");
})();
