const express = require('express');
const db = require('../db');

const router = express.Router();

router.post('/identify', async(req, res) => {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
        return res.status(400).json({ error: "At least one of email or phoneNumber is required." });
    }

    try {

        const [existingContacts] = await db.query(
            `SELECT * FROM contacts WHERE email = ? OR phoneNumber = ?`, [email, phoneNumber]
        );

        if (existingContacts.length === 0) {
            const [result] = await db.query(
                `INSERT INTO contacts (email, phoneNumber, linkPrecedence) VALUES (?, ?, 'primary')`, [email, phoneNumber]
            );

            return res.json({
                contact: {
                    primaryContactId: result.insertId,
                    emails: email ? [email] : [],
                    phoneNumbers: phoneNumber ? [phoneNumber] : [],
                    secondaryContactIds: []
                }
            });
        }


        let primaryContact = existingContacts.find(c => c.linkPrecedence === 'primary') || existingContacts[0];


        const [secondaryContacts] = await db.query(
            `SELECT * FROM contacts WHERE linkedId = ?`, [primaryContact.id]
        );


        const allContacts = [primaryContact, ...secondaryContacts];
        const emails = [...new Set(allContacts.map(c => c.email).filter(Boolean))];
        const phoneNumbers = [...new Set(allContacts.map(c => c.phoneNumber).filter(Boolean))];
        const secondaryContactIds = secondaryContacts.map(c => c.id);


        if (!emails.includes(email) || !phoneNumbers.includes(phoneNumber)) {
            const [newSecondary] = await db.query(
                `INSERT INTO contacts (email, phoneNumber, linkedId, linkPrecedence) VALUES (?, ?, ?, 'secondary')`, [email, phoneNumber, primaryContact.id]
            );
            secondaryContactIds.push(newSecondary.insertId);
        }

        return res.json({
            contact: {
                primaryContactId: primaryContact.id,
                emails,
                phoneNumbers,
                secondaryContactIds
            }
        });

    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;