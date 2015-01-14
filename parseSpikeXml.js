var fs = require('fs');
var	xml2js = require('xml2js');
var _ = require('underscore');
var system = require('system');

/**
 * Parses the SpikeDB XML file (http://www.cs.tau.ac.il/~spike/)
 *
 * @param args  program arguments
 */
function main(args)
{
	// TODO get input and output file names from program arguments

	var inputFile = "resource/LatestSpikeDB.xml";
	var outputFile = "./spikeDB.txt";

	var parser = new xml2js.Parser();
	var outputData = [];

	fs.readFile(inputFile, function(err, data)
	{
		parser.parseString(data, function (err, result)
		{
			//console.dir(result);

			var regulations = result["SpikeDatabase"]["RegulationBlock"][0]["Regulation"];
			var genes = result["SpikeDatabase"]["BuildingBlock"][0]["Gene"];
			var id2Name = {};

			// create a mapping to get gene names from gene references
			_.each(genes, function(ele) {
				var geneId = ele.$.id;
				var geneName = ele.$.name;

				id2Name[geneId] = geneName;
			});

			// for each regulation generate an output line with
			// source gene name, target gene name, and regulation mechanism triplets
			_.each(regulations, function(ele) {
				var targetId = ele["Target"][0].$.ref;
				var sourceId = ele["Source"][0].$.ref;
				var mechanism = ele.$.mechanism;
				var targetName = id2Name[targetId];
				var sourceName = id2Name[sourceId];

				if (sourceName && sourceName.length > 0 &&
				    targetName && targetName.length > 0)
				{
					var line = sourceName + "\t" + targetName + "\t" + mechanism;
					//console.log(line);
					outputData.push(line);
				}
			});

			// write the contents to the output file
			fs.writeFile(outputFile, outputData.join("\n"));
		});
	});
}

main(system.args);
