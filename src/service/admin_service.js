`use strict`;

const { sequelize } = require('./../database');

async function getAdminBestProfession({ start, end }) {
  console.log('GET Admin Best Profession, Args: ',
      { start, end });

  try {
    // Validate query params
    if (!start || start.length != 10 || isNaN(start) ||
    !end || end.length != 10 || isNaN(end)) {
      return { statusCode: 400 };
    }

    const startDate = new Date(parseInt(start) * 1000);
    const endDate = new Date(parseInt(end) * 1000);

    const bestProfession = await sequelize.query(`
    SELECT
      p.profession,
      SUM(j.price) AS totalEarnings
    FROM
      Profiles p
      INNER JOIN Contracts c ON (p.id = c.ContractorId)
      INNER JOIN Jobs j ON (c.id = j.ContractId)
    WHERE
      c.createdAt BETWEEN :startDate AND :endDate
      AND j.paid = true
    GROUP BY
      p.profession
    ORDER BY
      totalEarnings DESC
    LIMIT 1;`, {
      replacements: { startDate, endDate },
      type: sequelize.QueryTypes.SELECT
    });

    // Check for empty response
    if (!bestProfession || bestProfession.length === 0) {
      return { statusCode: 404 };
    }
    return {
      statusCode: 200,
      bestProfession: bestProfession[0].profession,
      totalEarnings: bestProfession[0].totalEarnings
    };
  } catch (error) {
    throw error;
  }
}

async function getAdminBesClients({ start, end, limit = 2 }) {
  console.log('GET Admin Best Clients, Args: ',
      { start, end, limit });

  try {
    // Validate query params
    if (!start || start.length != 10 || !parseInt(start) ||
    !end || end.length != 10 || !parseInt(end) || !parseInt(limit)) {
      return { statusCode: 400 };
    }

    const startDate = new Date(parseInt(start) * 1000);
    const endDate = new Date(parseInt(end) * 1000);
    const bestClients = await sequelize.query(`
    SELECT
      p.id,
      p."firstName" || ' ' || p."lastName" AS fullName,
      COALESCE(SUM(j.price), 0) AS totalPaid
    FROM
      "Profiles" p
      LEFT JOIN "Contracts" c ON p.id = c."ClientId"
      LEFT JOIN "Jobs" j ON c.id = j."ContractId"
    WHERE
      c."createdAt" BETWEEN :startDate AND :endDate
      AND j.paid = true
    GROUP BY
      p.id, fullName
    ORDER BY
      totalPaid DESC
    LIMIT :limit;`, {
      replacements: { startDate, endDate, limit },
      type: sequelize.QueryTypes.SELECT
    });
    // Check for empty response
    if (!bestClients || bestClients.length === 0) {
      return { statusCode: 404 };
    }

    // Format the response
    const formattedResponse = bestClients.map((client) => ({
      id: client.id,
      fullName: client.fullName,
      paid: client.totalPaid
    }));
    return {
      statusCode: 200,
      bestClients: formattedResponse
    };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAdminBestProfession,
  getAdminBesClients
};
