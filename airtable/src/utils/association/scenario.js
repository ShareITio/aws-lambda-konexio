const { distanceRatio } = require("./ratioProcessing");
const {
  translateApplicantKeys,
  translateLearnerKeys,
  getRatioExtension,
  ACCEPTATION_RATIO,
} = require("./tools");

// Scenario de la jointure entre candidatures et apprenants
export const scenarioSearchDuplicates = async (
  { data: applicantsData, records: applicantsRecords, bind },
  { data: learnersData, records: learnersRecord }
) => {
  for (const i in applicantsData) {
    // todo: passé si la candidature a deja été liée à cet apprenant
    const applicantData = applicantsData[i];
    const applicantsRecord = applicantsRecords[i];

    output.markdown("---");
    output.text(
      `Voici le candidat ${Number(i) + 1}/${applicantsData.length} à comparer: `
    );
    output.table(translateApplicantKeys(applicantData));

    // compare apprenant/candidature
    const learnersRatio = learnersData.map((learnerData) =>
      distanceRatio(learnerData, applicantData)
    );

    // filtrage des apprenant respectant la condition et inclusion des données, du record...
    const learnersFiltred = learnersRatio.reduce((acc, ratio, i) => {
      if (ratio >= ACCEPTATION_RATIO) {
        return [
          ...acc,
          { i, ratio, data: learnersData[i], record: learnersRecord[i] },
        ];
      }
      return acc;
    }, []);

    if (learnersFiltred.length < 1) {
      output.markdown("☑ Aucune similarité pour ce champs");
    } else {
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
};
