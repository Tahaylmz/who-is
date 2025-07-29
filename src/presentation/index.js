/**
 * 🖥️ Presentation Layer Index
 * Kullanıcı arayüzlerinin merkezi export'u
 */

// CLI Applications
const CLIApplication = require('./cli/CLIApplication');

// Web Applications  
const WebServer = require('./web/WebServer');

module.exports = {
    CLI: {
        CLIApplication
    },
    Web: {
        WebServer
    }
};
